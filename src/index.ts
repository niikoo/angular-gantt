import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GanttActivityComponent} from './gantt-activity/gantt-activity.component';
import {GroupByPipe} from './group-by.pipe';
import {GanttComponent} from './gantt/gantt.component';
import {GanttHeaderComponent} from './gantt-header/gantt-header.component';
import {GanttFooterComponent} from './gantt-footer/gantt-footer.component';
import {GanttActivityBackgroundComponent} from './gantt-activity-background/gantt-activity-background.component';
import {GanttActivityBarsComponent} from './gantt-activity-bars/gantt-activity-bars.component';
import {GanttTimeScaleComponent} from './gantt-time-scale/gantt-time-scale.component';
import { GanttService } from './gantt.service';

export * from './gantt/gantt.component';
export * from './group-by.pipe';
export * from './gantt.service';
export * from './interfaces';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GanttComponent,
    GanttActivityComponent,
    GanttComponent,
    GanttHeaderComponent,
    GanttFooterComponent,
    GanttActivityBackgroundComponent,
    GanttActivityBarsComponent,
    GanttTimeScaleComponent,
    GroupByPipe
  ],
  exports: [
    GanttComponent,
    GanttActivityComponent,
    GanttHeaderComponent,
    GanttFooterComponent,
    GanttActivityBackgroundComponent,
    GanttActivityBarsComponent,
    GanttTimeScaleComponent,
    GroupByPipe
  ]
})
export class GanttModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GanttModule,
      providers: [GanttService]
    };
  }
}
