import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInitializerComponent } from './dashboard-initializer.component';

describe('DashboardInitializerComponent', () => {
  let component: DashboardInitializerComponent;
  let fixture: ComponentFixture<DashboardInitializerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardInitializerComponent]
    });
    fixture = TestBed.createComponent(DashboardInitializerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
