import { DoCheck, EventEmitter, OnInit } from '@angular/core';
import { GanttService } from '../gantt.service';
import { IGanttOptions, GanttProject, TimeScale, IDimensions } from '../interfaces';
export declare class GanttActivityComponent implements OnInit, DoCheck {
    ganttService: GanttService;
    project: GanttProject;
    _options: IGanttOptions;
    options: IGanttOptions;
    onGridRowClick: EventEmitter<any>;
    upTriangle: string;
    downTriangle: string;
    zoom: EventEmitter<string>;
    activityActions: {
        expanded: boolean;
        expandedIcon: string;
    };
    timeScale: TimeScale;
    start: Date;
    end: Date;
    containerHeight: any;
    containerWidth: any;
    activityContainerSizes: any;
    ganttActivityHeight: any;
    ganttActivityWidth: any;
    zoomLevel: string;
    treeExpanded: boolean;
    scale: any;
    dimensions: IDimensions;
    data: any[];
    gridColumns: any[];
    constructor(ganttService: GanttService);
    ngOnInit(): void;
    /** Custom model check */
    ngDoCheck(): void;
    /** On vertical scroll set the scroll top of grid and activity  */
    onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void;
    /** Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE */
    toggleChildren(rowElem: any, task: any): void;
    /** Removes or adds children tasks back into DOM by updating TASK_CACHE */
    toggleAllChildren(): void;
    /** On resize of browser window dynamically adjust gantt activity height and width */
    onResize(event: any): void;
    setScale(): void;
    setDimensions(): void;
    setGridRowStyle(isParent: boolean): any;
    /** Set the zoom level e.g hours, days */
    zoomTasks(level: string): void;
    /** Expand the gantt grid and activity area height */
    expand(force?: boolean): void;
    /** Get the status icon unicode string */
    getStatusIcon(status: string, percentComplete: number): string;
    /** Get the status icon color */
    getStatusIconColor(status: string, percentComplete: number): string;
    setGridScaleStyle(): {
        'height': string;
        'line-height': string;
        'width': string;
    };
    private calculateContainerHeight();
    private calculateContainerWidth();
    private setSizes();
}
