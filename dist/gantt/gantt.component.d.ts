import { EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { IGanttOptions, GanttProject } from '../interfaces';
import { GanttService } from '../gantt.service';
export declare class GanttComponent implements OnInit {
    private ganttService;
    private changeDetector;
    /**
     * @see https://github.com/dalestone/angular2-gantt/tree/master/src/demo-app
     */
    _project: GanttProject;
    _options: IGanttOptions;
    project: GanttProject;
    projectUpdates: EventEmitter<void>;
    readonly options: IGanttOptions;
    onGridRowClick: EventEmitter<any>;
    private ganttContainerWidth;
    constructor(ganttService: GanttService, changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    setSizes(): void;
    scaleToTasks(): void;
    setDefaultProject(): void;
    gridRowClicked(task: any): void;
    onResize($event: any): void;
}
