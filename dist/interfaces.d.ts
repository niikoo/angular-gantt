export interface GanttProject {
    id: string;
    name: string;
    startDate?: Date;
    tasks: Task[];
}
export interface Task {
    id: string;
    treePath: string;
    parentId: string;
    name: string;
    resource?: string;
    start: Date;
    end?: Date;
    percentComplete?: number;
    status?: string;
}
export declare type TimeScale = Date[];
export interface IGanttOptions {
    scale?: IScale;
    zooming?: string;
}
export interface IScale {
    start?: Date;
    end?: Date;
    auto?: boolean;
}
export interface IBarStyle {
    status: string;
    backgroundColor: string;
    border: string;
    progressBackgroundColor: string;
}
export declare enum Zooming {
    hours = 0,
    days = 1,
}
export interface IDimensions {
    width: number;
    height: number;
}
export declare type Cell = any;
