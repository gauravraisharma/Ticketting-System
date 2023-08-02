import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompnayManagementComponent } from './compnay-management.component';

describe('CompnayManagementComponent', () => {
  let component: CompnayManagementComponent;
  let fixture: ComponentFixture<CompnayManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompnayManagementComponent]
    });
    fixture = TestBed.createComponent(CompnayManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
