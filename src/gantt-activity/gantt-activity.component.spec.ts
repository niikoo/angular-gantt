import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttActivityComponent } from './gantt-activity.component';

describe('GanttActivityComponent', () => {
  let component: GanttActivityComponent;
  let fixture: ComponentFixture<GanttActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
