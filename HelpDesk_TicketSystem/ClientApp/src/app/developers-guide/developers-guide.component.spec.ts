import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopersGuideComponent } from './developers-guide.component';

describe('DevelopersGuideComponent', () => {
  let component: DevelopersGuideComponent;
  let fixture: ComponentFixture<DevelopersGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevelopersGuideComponent]
    });
    fixture = TestBed.createComponent(DevelopersGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
