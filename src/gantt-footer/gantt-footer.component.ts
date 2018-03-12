import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'gantt-footer',
  templateUrl: './gantt-footer.component.html',
  styleUrls: ['./gantt-footer.component.css']
})
export class GanttFooterComponent implements OnInit {

  @Input() project: any;

  constructor() {
  }

  ngOnInit() {
  }

}
