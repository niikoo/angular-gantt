import {Component, Input, OnInit} from '@angular/core';
import {Zooming} from '../interfaces';
import {GanttService} from '../gantt.service';
import { isNil } from 'lodash';

@Component({
  selector: 'gantt-time-scale',
  templateUrl: './gantt-time-scale.component.html',
  styleUrls: ['./gantt-time-scale.component.css']
})
export class GanttTimeScaleComponent implements OnInit {

  @Input() timeScale: any;
  @Input() dimensions: any;
  @Input() zoom: any;
  @Input() zoomLevel: any;

  constructor(public ganttService: GanttService) {
  }

  ngOnInit() {
    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
    });
  }

  private setTimescaleStyle() {
    return {
      'width': this.dimensions.width + 'px'
    };
  }

  private setTimescaleLineStyle(borderTop: string) {
    return {
      'height': this.ganttService.rowHeight + 'px',
      'line-height': this.ganttService.rowHeight + 'px',
      'position': 'relative',
      'border-top': borderTop
    };
  }

  private setTimescaleCellStyle() {
    let width = this.ganttService.cellWidth;
    const hoursInDay = 24;
    const hourSeperatorPixels = 23; // we don't include the first

    if (this.zoomLevel === Zooming[Zooming.hours]) {
      width = this.ganttService.hourCellWidth * hoursInDay + hourSeperatorPixels;
    }

    return {
      'width': width + 'px'
    };
  }

  private isDayWeekend(date: Date): boolean {
    return this.ganttService.isDayWeekend(date);
  }

  private getHours(): string[] {
    if (!isNil(this.timeScale) && 'length' in this.timeScale) {
      return this.ganttService.getHours(this.timeScale.length);
    }
  }

}
