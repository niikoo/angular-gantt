import {ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GanttService} from '../gantt.service';
import {Zooming} from '../interfaces';


@Component({
  selector: 'gantt-activity',
  templateUrl: './gantt-activity.component.html',
  styleUrls: ['./gantt-activity.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GanttActivityComponent implements OnInit, DoCheck {
  @Input() project: any;
  @Input() options: any;
  @Output() onGridRowClick: EventEmitter<any> = new EventEmitter<any>();

  upTriangle = '&#x25b2;'; // BLACK UP-POINTING TRIANGLE
  downTriangle = '&#x25bc;'; // BLACK DOWN-POINTING TRIANGLE
  zoom: EventEmitter<string> = new EventEmitter<string>();
  activityActions = {
    expanded: false,
    expandedIcon: this.downTriangle
  };

  timeScale: any;

  start: Date;
  end: Date;
  containerHeight: any;
  containerWidth: any;

  activityContainerSizes: any;
  ganttActivityHeight: any;
  ganttActivityWidth: any;
  zoomLevel: string = Zooming[Zooming.hours];

  treeExpanded = false;

  scale: any = {
    start: null,
    end: null
  };

  dimensions = {
    height: 0,
    width: 0
  };

  data: any[] = [];

  public gridColumns: any[] = [
    {name: '', left: 0, width: 16},
    {name: 'Task', left: 20, width: 330},
    {name: '%', left: 8, width: 40},
    {name: 'Duration', left: 14, width: 140}
  ];

  constructor(public ganttService: GanttService) {
  }

  ngOnInit() {
    // Cache the project data and only work with that. Only show parent tasks by default
    this.ganttService.TASK_CACHE = this.project.tasks.slice(0).filter((item: any) => {
      return item.treePath.split('/').length === 1;
    });
    this.ganttService.TIME_SCALE = this.ganttService.calculateScale(this.options.scale.start, this.options.scale.end);

    this.zoomLevel = this.options.zooming;
    this.start = this.options.scale.start;
    this.end = this.options.scale.end;
    this.containerWidth = this.calculateContainerWidth();
    this.containerHeight = this.calculateContainerHeight();
    this.activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();

    // important that these are called last as it relies on values calculated above.
    this.setScale();
    this.setDimensions();
    this.setSizes();

    this.expand(); // default to expanded
  }

  /** Custom model check */
  ngDoCheck() {
    // do a check to see whether any new tasks have been added. If the task is a child then push into array if tree expanded?
    const tasksAdded = this.ganttService.doTaskCheck(this.project.tasks, this.treeExpanded);

    // only force expand if tasks are added and tree is already expanded
    if (tasksAdded && this.activityActions.expanded) {
      this.expand(true);
    }
  }

  /** On vertical scroll set the scroll top of grid and activity  */
  onVerticalScroll(verticalScroll: any, ganttGrid: any, ganttActivityArea: any): void {
    this.ganttService.scrollTop(verticalScroll, ganttGrid, ganttActivityArea);
  }

  /** Removes or adds children for given parent tasks back into DOM by updating TASK_CACHE */
  toggleChildren(rowElem: any, task: any) {
    try {
      const isParent: boolean = 'true' === rowElem.getAttribute('data-isparent');
      const parentId: string = rowElem.getAttribute('data-parentid').replace('_', ''); // remove id prefix
      const children: any = document.querySelectorAll('[data-parentid=' + rowElem.getAttribute('data-parentid') + '][data-isparent=false]');

      // use the task cache to allow deleting of items without polluting the project.tasks array
      if (isParent) {
        // remove children from the DOM as we don't want them if we are collapsing the parent
        if (children.length > 0) {
          const childrenIds: any[] = this.ganttService.TASK_CACHE.filter((task1: any) => {
            return task1.parentId === parentId && task1.treePath.split('/').length > 1;
          }).map((item: any) => item.id);

          childrenIds.forEach((item: any) => {
            const removedIndex = this.ganttService.TASK_CACHE.map((item1: any) => item1.id).indexOf(item);

            this.ganttService.TASK_CACHE.splice(removedIndex, 1);
          });

          if (this.activityActions.expanded) {
            this.expand(true);
          }

        } else {
          // CHECK the project cache to see if this parent id has any children
          // and if so push them back into array so DOM is updated
          const childrenTasks: any[] = this.project.tasks.filter((task1: any) => {
            return task1.parentId === parentId && task1.treePath.split('/').length > 1;
          });

          childrenTasks.forEach((task1: any) => {
            this.ganttService.TASK_CACHE.push(task1);
          });

          if (this.activityActions.expanded) {
            this.expand(true);
          }
        }
      }

      this.onGridRowClick.emit(task);

    } catch (err) {
    }
  }

  /** Removes or adds children tasks back into DOM by updating TASK_CACHE */
  toggleAllChildren() {
    try {
      const children: any = document.querySelectorAll('[data-isparent=false]');
      const childrenIds: string[] = Array.prototype.slice.call(children).map((item: any) => {
        return item.getAttribute('data-id').replace('_', ''); // remove id prefix
      });

      // push all the children array items into cache
      if (this.treeExpanded) {
        if (children.length > 0) {
          const childIds: string[] = this.ganttService.TASK_CACHE.filter((task: any) => {
            return task.treePath.split('/').length > 1;
          }).map((item: any) => item.id);

          childIds.forEach((item: any) => {
            const removedIndex = this.ganttService.TASK_CACHE.map((item1: any) => item1.id).indexOf(item);
            this.ganttService.TASK_CACHE.splice(removedIndex, 1);
          });
        }

        this.treeExpanded = false;

        if (this.activityActions.expanded) {
          this.expand(true);
        }
      } else {
        // get all children tasks in project input
        let childrenTasks: any[] = this.project.tasks.filter((task: any) => {
          return task.treePath.split('/').length > 1;
        });

        if (children.length > 0) {
          // filter out these children as they already exist in task cache
          childrenTasks = childrenTasks.filter((task: any) => {
            return childrenIds.indexOf(task.id) === -1;
          });
        }

        childrenTasks.forEach((task: any) => {
          this.ganttService.TASK_CACHE.push(task);
        });

        this.treeExpanded = true;

        if (this.activityActions.expanded) {
          this.expand(true);
        }
      }
    } catch (err) {
    }
  }

  /** On resize of browser window dynamically adjust gantt activity height and width */
  onResize(event: any): void {
    const activityContainerSizes = this.ganttService.calculateActivityContainerDimensions();
    if (this.activityActions.expanded) {
      this.ganttActivityHeight = this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3 + 'px';
    } else {
      this.ganttActivityHeight = activityContainerSizes.height + 'px';
    }

    this.ganttActivityWidth = activityContainerSizes.width;
  }

  setScale() {
    this.scale.start = this.start;
    this.scale.end = this.end;
  }

  setDimensions() {
    this.dimensions.height = this.containerHeight;
    this.dimensions.width = this.containerWidth;
  }

  setGridRowStyle(isParent: boolean): any {
    if (isParent) {
      return {
        'height': this.ganttService.rowHeight + 'px',
        'line-height': this.ganttService.rowHeight + 'px',
        'font-weight': 'bold',
        'cursor': 'pointer'
      };
    }

    return {
      'height': this.ganttService.rowHeight + 'px',
      'line-height': this.ganttService.rowHeight + 'px'
    };
  }

  /** Set the zoom level e.g hours, days */
  zoomTasks(level: string) {
    this.zoomLevel = level;
    this.zoom.emit(this.zoomLevel);
    this.containerWidth = this.calculateContainerWidth();
    this.setDimensions();
    document.querySelector('.gantt_activity').scrollLeft = 0; // reset scroll left, replace with @ViewChild?
  }

  /** Expand the gantt grid and activity area height */
  expand(force?: boolean): void {
    const verticalScroll = document.querySelector('.gantt_vertical_scroll');
    const ganttActivityHeight = `${this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight + this.ganttService.rowHeight * 3}px`;

    if (force && this.activityActions.expanded) {
      this.ganttActivityHeight = ganttActivityHeight;
    } else if (this.activityActions.expanded) {
      this.activityActions.expanded = false;
      this.activityActions.expandedIcon = this.downTriangle;
      this.ganttActivityHeight = '300px';
    } else {
      verticalScroll.scrollTop = 0;

      this.activityActions.expanded = true;
      this.activityActions.expandedIcon = this.upTriangle;
      this.ganttActivityHeight = ganttActivityHeight;
    }
  }

  /** Get the status icon unicode string */
  getStatusIcon(status: string, percentComplete: number): string {
    const checkMarkIcon = '&#x2714;';
    const upBlackPointer = '&#x25b2;';
    const crossMarkIcon = '&#x2718;';

    if (status === 'Completed' || percentComplete === 100 && status !== 'Error') {
      return checkMarkIcon;
    } else if (status === 'Warning') {
      return upBlackPointer;
    } else if (status === 'Error') {
      return crossMarkIcon;
    }
    return '';
  }

  /** Get the status icon color */
  getStatusIconColor(status: string, percentComplete: number): string {
    if (status === 'Completed' || percentComplete === 100 && status !== 'Error') {
      return 'green';
    } else if (status === 'Warning') {
      return 'orange';
    } else if (status === 'Error') {
      return 'red';
    }
    return '';
  }

  private setGridScaleStyle() {
    let height = this.ganttService.rowHeight;

    if (this.zoomLevel === Zooming[Zooming.hours]) {
      height *= 2;
    }

    return {
      'height': height + 'px',
      'line-height': height + 'px',
      'width': this.ganttService.gridWidth + 'px'
    };
  }

  private calculateContainerHeight(): number {
    return this.ganttService.TASK_CACHE.length * this.ganttService.rowHeight;
  }

  private calculateContainerWidth(): number {
    if (this.zoomLevel === Zooming[Zooming.hours]) {
      return this.ganttService.TIME_SCALE.length * this.ganttService.hourCellWidth * 24 + this.ganttService.hourCellWidth;
    } else {
      return this.ganttService.TIME_SCALE.length * this.ganttService.cellWidth + this.ganttService.cellWidth;
    }
  }

  private setSizes(): void {
    this.ganttActivityHeight = this.activityContainerSizes.height + 'px';
    this.ganttActivityWidth = this.activityContainerSizes.width;
  }

}
