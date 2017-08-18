import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttActivityBarsComponent } from './gantt-activity-bars.component';

describe('GanttActivityBarsComponent', () => {
  let component: GanttActivityBarsComponent;
  let fixture: ComponentFixture<GanttActivityBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttActivityBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttActivityBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
