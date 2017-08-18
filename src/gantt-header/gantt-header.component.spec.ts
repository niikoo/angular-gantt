import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttHeaderComponent } from './gantt-header.component';

describe('GanttHeaderComponent', () => {
  let component: GanttHeaderComponent;
  let fixture: ComponentFixture<GanttHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
