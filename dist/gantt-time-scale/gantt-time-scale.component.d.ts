import { OnInit } from '@angular/core';
import { TimeScale } from '../interfaces';
import { GanttService } from '../gantt.service';
import { Observable } from 'rxjs/Observable';
export declare class GanttTimeScaleComponent implements OnInit {
    ganttService: GanttService;
    timeScale: TimeScale;
    dimensions: any;
    zoom: Observable<string>;
    zoomLevel: string;
    constructor(ganttService: GanttService);
    ngOnInit(): void;
    setTimescaleStyle(): {
        'width': string;
    };
    setTimescaleLineStyle(borderTop: string): {
        'height': string;
        'line-height': string;
        'position': string;
        'border-top': string;
    };
    private setTimescaleCellStyle();
    private isDayWeekend(date);
    private getHours();
}
