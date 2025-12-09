/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookLoanNavComponent } from './book-loan-nav.component';

describe('BookLoanNavComponent', () => {
  let component: BookLoanNavComponent;
  let fixture: ComponentFixture<BookLoanNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookLoanNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLoanNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
