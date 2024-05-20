import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterapplicationComponent } from './registerapplication.component';

describe('RegisterapplicationComponent', () => {
  let component: RegisterapplicationComponent;
  let fixture: ComponentFixture<RegisterapplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterapplicationComponent]
    });
    fixture = TestBed.createComponent(RegisterapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
