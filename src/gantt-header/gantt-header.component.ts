import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gantt-header',
  templateUrl: './gantt-header.component.html',
  styleUrls: ['./gantt-header.component.css']
})
export class GanttHeaderComponent implements OnInit {

  @Input() name: any;
  @Input() startDate: Date;

  constructor() {
  }

  ngOnInit() {
  }

}
