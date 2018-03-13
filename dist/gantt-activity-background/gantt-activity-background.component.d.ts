import { ElementRef, OnInit, EventEmitter } from '@angular/core';
import { TimeScale, Task, Cell } from '../interfaces';
import { GanttService } from '../gantt.service';
export declare class GanttActivityBackgroundComponent implements OnInit {
    ganttService: GanttService;
    private _tasks;
    tasks: Task[];
    timeScale: TimeScale;
    zoom: EventEmitter<string>;
    zoomLevel: string;
    bg: ElementRef;
    onChanges: EventEmitter<void>;
    cells: Cell[];
    constructor(ganttService: GanttService);
    ngOnInit(): void;
    isDayWeekend(date: Date): boolean;
    private setRowStyle();
    private setCellStyle();
    private drawGrid();
}
