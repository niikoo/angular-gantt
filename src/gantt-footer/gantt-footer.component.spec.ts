import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttFooterComponent } from './gantt-footer.component';

describe('GanttFooterComponent', () => {
  let component: GanttFooterComponent;
  let fixture: ComponentFixture<GanttFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
