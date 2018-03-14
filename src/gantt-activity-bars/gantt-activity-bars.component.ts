import {Component, Input, OnInit, EventEmitter} from '@angular/core';
import {Zooming, TimeScale, Task, IDimensions} from '../interfaces';
import {GanttService} from '../gantt.service';

@Component({
  selector: 'gantt-activity-bars',
  templateUrl: './gantt-activity-bars.component.html',
  styleUrls: ['./gantt-activity-bars.component.css']
})
export class GanttActivityBarsComponent implements OnInit {

  @Input() timeScale: TimeScale;
  @Input() dimensions: IDimensions;
  @Input() tasks: Task[];
  @Input() zoom: EventEmitter<string>;
  @Input() zoomLevel: string;

  public containerHeight = 0;
  public containerWidth = 0;
  resizeable = '';

  constructor(public ganttService: GanttService) {
    this.resizeable = (this.ganttService.barResizeable) ? 'resizeable' : '';
  }

  ngOnInit() {
    this.containerHeight = this.dimensions.height;
    this.containerWidth = this.dimensions.width;

    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
    });
  }

  // TODO(dale): the ability to move bars needs reviewing and there are a few quirks
  expandLeft($event: any, bar: any) {
    $event.stopPropagation();

    const ganttService = this.ganttService;
    const startX = $event.clientX;
    const startBarWidth = bar.style.width;
    const startBarLeft = bar.style.left;

    function doDrag(e: any) {
      const cellWidth = ganttService.cellWidth;
      const barWidth = startBarWidth - e.clientX + startX;
      const days = Math.round(barWidth / cellWidth);

      bar.style.width = days * cellWidth + days;
      bar.style.left = (startBarLeft - (days * cellWidth) - days);
    }

    this.addMouseEventListeners(doDrag);

    return false;
  }

  expandRight($event: any, bar: any) {
    $event.stopPropagation();

    const ganttService = this.ganttService;
    const startX = $event.clientX;
    const startBarWidth = bar.style.width;
    const startBarEndDate = bar.task.end;
    const startBarLeft = bar.style.left;

    function doDrag(e: any) {
      const cellWidth = ganttService.cellWidth;
      let barWidth = startBarWidth + e.clientX - startX;
      let days = Math.round(barWidth / cellWidth);

      if (barWidth < cellWidth) {
        barWidth = cellWidth;
        days = Math.round(barWidth / cellWidth);
      }
      bar.style.width = ((days * cellWidth) + days); // rounds to the nearest cell
    }

    this.addMouseEventListeners(doDrag);

    return false;
  }

  move($event: any, bar: any) {
    $event.stopPropagation();

    const ganttService = this.ganttService;
    const startX = $event.clientX;
    const startBarLeft = bar.style.left;

    function doDrag(e: any) {
      const cellWidth = ganttService.cellWidth;
      const barLeft = startBarLeft + e.clientX - startX;
      const days = Math.round(barLeft / cellWidth);

      // TODO: determine how many days the bar can be moved
      // if (days < maxDays) {
      bar.style.left = ((days * cellWidth) + days); // rounded to nearest cell

      // keep bar in bounds of grid
      if (barLeft < 0) {
        bar.style.left = 0;
      }
      // }
      // TODO: it needs to take into account the max number of days.
      // TODO: it needs to take into account the current days.
      // TODO: it needs to take into account the right boundary.
    }

    this.addMouseEventListeners(doDrag);

    return false;
  }

  private drawBar(task: any, index: number) {
    let style = {};

    if (this.zoomLevel === Zooming[Zooming.hours]) {
      style = this.ganttService.calculateBar(task, index, this.timeScale, true);
    } else {
      style = this.ganttService.calculateBar(task, index, this.timeScale);
    }
    return style;
  }

  private drawProgress(task: any, bar: any): any {
    const barStyle = this.ganttService.getBarProgressStyle(task.status);
    const width = this.ganttService.calculateBarProgress(this.ganttService.getComputedStyle(bar, 'width'), task.percentComplete);

    return {
      'width': width,
      'background-color': barStyle['background-color'],
    };
  }

  private addMouseEventListeners(dragFn: any) {

    function stopFn() {
      document.documentElement.removeEventListener('mousemove', dragFn, false);
      document.documentElement.removeEventListener('mouseup', stopFn, false);
      document.documentElement.removeEventListener('mouseleave', stopFn, false);
    }

    document.documentElement.addEventListener('mousemove', dragFn, false);
    document.documentElement.addEventListener('mouseup', stopFn, false);
    document.documentElement.addEventListener('mouseleave', stopFn, false);
  }

}
