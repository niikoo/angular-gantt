import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {IGanttOptions, GanttProject, Zooming} from '../interfaces';
import {GanttService} from '../gantt.service';
import {isNil, isEqual} from 'lodash';

@Component({
  selector: 'gantt-component',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit {
  
  /**
   * @see https://github.com/dalestone/angular2-gantt/tree/master/src/demo-app
   */
  _project: GanttProject = {
    id: '',
    name: '',
    startDate: new Date(),
    tasks: []
  };
  _options: IGanttOptions = {
        scale: {
            start: new Date(2018, 0, 1),
            end: new Date(2019, 1, 1)
        },
        zooming: Zooming[Zooming.days]
    };

  // TODO(dale): this may be causing an issue in the tree builder?
  @Input()
  set project(project: GanttProject) {
    if (isNil(project) || isEqual(this._project, project)) {
      return;
    }
    this._project = project;
    this.projectUpdates.emit();
  }

  get project() {
    return this._project;
  }

  projectUpdates = new EventEmitter<void>();

  /*@Input()
  set options(options: any) {
    if (options.scale) {
      this._options = options;
    } else {
      // this.setDefaultOptions();
    }
  }*/

  get options() {
    return this._options;
  }

  @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();

  private ganttContainerWidth: number;

  constructor(
    private ganttService: GanttService,
    private changeDetector: ChangeDetectorRef
  ) {
    window['ganttComponent'] = this;
    this.projectUpdates.subscribe((s) => {
      if (this.options.scale.auto) {
        this.scaleToTasks();
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnInit() {

  }

  setSizes(): void {
    this.ganttContainerWidth = this.ganttService.calculateContainerWidth();
  }

  scaleToTasks() {
    const scale = this.ganttService.calculateGridScale(this._project.tasks);

    this._options = {
      scale: scale
    };
  }

  setDefaultProject() {
    this._project = {
      id: '1',
      name: 'Sample',
      startDate: new Date(),
      tasks: []
    };
  }

  gridRowClicked(task: any) {
    this.onGridRowClick.emit(task);
  }

  onResize($event: any): void {
    this.setSizes();
  }

}
