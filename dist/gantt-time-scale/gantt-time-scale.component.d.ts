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
    private setTimescaleStyle();
    private setTimescaleLineStyle(borderTop);
    private setTimescaleCellStyle();
    private isDayWeekend(date);
    private getHours();
}
