import { Injectable } from '@angular/core';

@Injectable()
export class GanttConfig {
    public cellWidth = 76;
    public rowHeight = 25;
    public activityHeight = 300;
    public barHeight = 20;
    public barLineHeight = 20;
    public barMoveable = false;
}
