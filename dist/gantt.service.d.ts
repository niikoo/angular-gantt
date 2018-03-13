import { IScale, Task } from './interfaces';
export declare class GanttService {
    rowHeight: number;
    hourCellWidth: number;
    hoursCellWidth: number;
    cellWidth: number;
    windowInnerWidth: number;
    activityHeight: number;
    barHeight: number;
    barLineHeight: number;
    barTop: number;
    barMoveable: boolean;
    barResizeable: boolean;
    gridWidth: number;
    private barStyles;
    TASK_CACHE: any[];
    TIME_SCALE: any[];
    constructor();
    private calculateBarWidth(start, end, hours?);
    private calculateBarLeft(start, scale, hours?);
    /** Calculates the height of the gantt grid, activity and vertical scroll */
    calculateGanttHeight(): string;
    private calculateBarLeftDelta(start, hours?);
    isParent(treePath: string): boolean;
    isChild(treePath: string): "0px" | "20px";
    /** Calculate the bar styles */
    calculateBar(task: any, index: number, scale: any, hours?: boolean): {
        'top': string;
        'left': string;
        'height': string;
        'line-height': string;
        'width': string;
        'background-color': any;
        'border': any;
    };
    /** Get the bar style based on task status */
    private getBarStyle(taskStatus?);
    /** Get the progresss bar background colour based on task status */
    getBarProgressStyle(taskStatus?: string): any;
    /** Calculates the bar progress width in pixels given task percent complete */
    calculateBarProgress(width: number, percent: number): string;
    /** Calculates the difference in two dates and returns number of days */
    calculateDiffDays(start: Date, end: Date): number;
    /** Calculates the difference in two dates and returns number of hours */
    calculateDuration(task: any): string;
    calculateTotalDuration(tasks: any[]): string;
    /** Calculate the total percentage of a group of tasks */
    calculateTotalPercentage(node: any): number;
    /** Calculate the total percent of the parent task */
    calculateParentTotalPercentage(parent: any, tasks: any[]): any;
    /** Calculate the gantt scale range given the start and end date of tasks*/
    calculateScale(start?: Date, end?: Date): any[];
    /** Determines whether given date is a weekend */
    isDayWeekend(date: Date): boolean;
    /** Add x number of days to a date object */
    addDays(date: Date, days: number): Date;
    /** Remove x number of days from a date object */
    removeDays(date: Date, days: number): Date;
    /** Calculates the grid scale for gantt based on tasks start and end dates */
    calculateGridScale(tasks: Task[]): IScale;
    /** Create an hours array for use in time scale component */
    getHours(cols: number): string[];
    getComputedStyle(element: any, attribute: any): number;
    calculateContainerWidth(): number;
    calculateActivityContainerDimensions(): any;
    /** Set the vertical scroll top positions for gantt */
    scrollTop(verticalScrollElem: any, ganttGridElem: any, ganttActivityAreaElem: any): void;
    /** Group data by id , only supports one level*/
    groupData(tasks: any): any;
    /** Create tree of data */
    transformData(input: any): any;
    /** Checks whether any new data needs to be added to task cache  */
    doTaskCheck(tasks: any[], treeExpanded: boolean): boolean;
    /** Set a id prefix so CSS3 query selector can work with ids that contain numbers */
    setIdPrefix(id: string): string;
    /** Set the scroll top property of a native DOM element */
    private setScrollTop(scrollTop, element);
}
