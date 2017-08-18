import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttTimeScaleComponent } from './gantt-time-scale.component';

describe('GanttTimeScaleComponent', () => {
  let component: GanttTimeScaleComponent;
  let fixture: ComponentFixture<GanttTimeScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttTimeScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttTimeScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
