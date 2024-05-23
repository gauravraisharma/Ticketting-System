import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotAuthorizedComponent } from './page-not-authorized.component';

describe('PageNotAuthorizedComponent', () => {
  let component: PageNotAuthorizedComponent;
  let fixture: ComponentFixture<PageNotAuthorizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotAuthorizedComponent]
    });
    fixture = TestBed.createComponent(PageNotAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
