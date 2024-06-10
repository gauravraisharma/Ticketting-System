import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInternalErrorComponent } from './page-internal-error.component';

describe('PageNotAuthorizedComponent', () => {
  let component: PageInternalErrorComponent;
  let fixture: ComponentFixture<PageInternalErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageInternalErrorComponent]
    });
    fixture = TestBed.createComponent(PageInternalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
