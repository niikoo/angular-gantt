import { OnInit, EventEmitter } from '@angular/core';
import { TimeScale, Task, IDimensions } from '../interfaces';
import { GanttService } from '../gantt.service';
export declare class GanttActivityBarsComponent implements OnInit {
    ganttService: GanttService;
    timeScale: TimeScale;
    dimensions: IDimensions;
    tasks: Task[];
    zoom: EventEmitter<string>;
    zoomLevel: string;
    private containerHeight;
    private containerWidth;
    resizeable: string;
    constructor(ganttService: GanttService);
    ngOnInit(): void;
    expandLeft($event: any, bar: any): boolean;
    expandRight($event: any, bar: any): boolean;
    move($event: any, bar: any): boolean;
    private drawBar(task, index);
    private drawProgress(task, bar);
    private addMouseEventListeners(dragFn);
}
