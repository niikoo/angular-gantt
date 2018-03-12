import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Zooming} from '../interfaces';
import {GanttService} from '../gantt.service';

@Component({
  selector: 'gantt-activity-background',
  templateUrl: './gantt-activity-background.component.html',
  styleUrls: ['./gantt-activity-background.component.css']
})
export class GanttActivityBackgroundComponent implements OnInit {

  @Input() tasks: any;
  @Input() timeScale: any;
  @Input() zoom: any;
  @Input() zoomLevel: string;

  @ViewChild('bg') bg: ElementRef;

  cells: any[] = [];

  constructor(public ganttService: GanttService) {
  }

  ngOnInit() {
    this.drawGrid();

    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
      this.drawGrid();
    });
  }

  isDayWeekend(date: Date): boolean {
    return this.ganttService.isDayWeekend(date);
  }

  private setRowStyle() {
    return {
      'height': this.ganttService.rowHeight + 'px'
    };
  }

  private setCellStyle() {
    let width = this.ganttService.cellWidth;

    if (this.zoomLevel === Zooming[Zooming.hours]) {
      width = this.ganttService.hourCellWidth;
    }

    return {
      'width': width + 'px'
    };
  }

  private drawGrid(): void {
    if (this.zoomLevel === Zooming[Zooming.hours]) {
      this.cells = [];

      this.timeScale.forEach((date: any) => {
        for (let i = 0; i <= 23; i++) {
          this.cells.push(date);
        }
      });
    } else {
      this.cells = this.timeScale;
    }
  }
}
