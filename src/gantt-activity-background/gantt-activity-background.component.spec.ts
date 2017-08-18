import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttActivityBackgroundComponent } from './gantt-activity-background.component';

describe('GanttActivityBackgroundComponent', () => {
  let component: GanttActivityBackgroundComponent;
  let fixture: ComponentFixture<GanttActivityBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttActivityBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttActivityBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
