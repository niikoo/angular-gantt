import {Component, ElementRef, Input, OnInit, ViewChild, EventEmitter} from '@angular/core';
import {Zooming, TimeScale, Task, Cell} from '../interfaces';
import {GanttService} from '../gantt.service';
import { isNil, isObject, isEqual } from 'lodash';

@Component({
  selector: 'gantt-activity-background',
  templateUrl: './gantt-activity-background.component.html',
  styleUrls: ['./gantt-activity-background.component.css']
})
export class GanttActivityBackgroundComponent implements OnInit {
  private _tasks: Task[];

  @Input()
  get tasks(): Task[] {
    return this._tasks;
  }
  set tasks(tasks: Task[]) {
    if (!isNil(tasks) && isObject(tasks) && !isEqual(tasks, this._tasks)) {
      this._tasks = tasks;
      this.onChanges.emit();
    }
  }
  @Input() timeScale: TimeScale;
  @Input() zoom: EventEmitter<string>;
  @Input() zoomLevel: string;

  @ViewChild('bg') bg: ElementRef;

  onChanges = new EventEmitter<void>();

  cells: Cell[] = [];

  constructor(public ganttService: GanttService) {
    this.onChanges.subscribe(
      () => this.drawGrid()
    )
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

  private setRowStyle(): { height: string } {
    return {
      'height': this.ganttService.rowHeight + 'px'
    };
  }

  private setCellStyle(): { width: string } {
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

      this.timeScale.forEach((date: Date) => {
        for (let i = 0; i <= 23; i++) {
          this.cells.push(date);
        }
      });
    } else {
      this.cells = this.timeScale;
    }
  }
}
