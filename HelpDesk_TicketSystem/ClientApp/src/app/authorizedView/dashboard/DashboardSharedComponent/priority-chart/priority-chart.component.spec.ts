import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityChartComponent } from './priority-chart.component';

describe('PriorityChartComponent', () => {
  let component: PriorityChartComponent;
  let fixture: ComponentFixture<PriorityChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityChartComponent]
    });
    fixture = TestBed.createComponent(PriorityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
