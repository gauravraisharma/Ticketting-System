import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretKeyDialogComponent } from './secret-key-dialog.component';

describe('SecretKeyDialogComponent', () => {
  let component: SecretKeyDialogComponent;
  let fixture: ComponentFixture<SecretKeyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecretKeyDialogComponent]
    });
    fixture = TestBed.createComponent(SecretKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
