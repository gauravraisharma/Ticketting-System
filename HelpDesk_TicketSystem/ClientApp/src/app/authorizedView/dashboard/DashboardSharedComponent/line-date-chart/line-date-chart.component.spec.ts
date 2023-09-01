import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDateChartComponent } from './line-date-chart.component';

describe('LineDateChartComponent', () => {
  let component: LineDateChartComponent;
  let fixture: ComponentFixture<LineDateChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineDateChartComponent]
    });
    fixture = TestBed.createComponent(LineDateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
