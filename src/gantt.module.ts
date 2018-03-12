import {NgModule} from '@angular/core';

import {GanttActivityComponent} from './gantt-activity/gantt-activity.component';
import {GroupByPipe} from './group-by.pipe';
import {GanttComponent} from './gantt/gantt.component';
import {GanttHeaderComponent} from './gantt-header/gantt-header.component';
import {GanttFooterComponent} from './gantt-footer/gantt-footer.component';
import {GanttActivityBackgroundComponent} from './gantt-activity-background/gantt-activity-background.component';
import {GanttActivityBarsComponent} from './gantt-activity-bars/gantt-activity-bars.component';
import {GanttTimeScaleComponent} from './gantt-time-scale/gantt-time-scale.component';
import {CommonModule} from '@angular/common';
import { GanttService } from 'index';

@NgModule({
  declarations: [
    GanttComponent,
    GanttActivityComponent,
    GroupByPipe,
    GanttComponent,
    GanttHeaderComponent,
    GanttFooterComponent,
    GanttActivityBackgroundComponent,
    GanttActivityBarsComponent,
    GanttTimeScaleComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    GanttService
  ],
  exports: [GanttComponent],
  bootstrap: [GanttComponent]
})
export class GanttModule {
}
