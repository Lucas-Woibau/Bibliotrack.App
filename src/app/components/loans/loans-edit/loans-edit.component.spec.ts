import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansEditComponent } from './loans-edit.component';

describe('LoansEditComponent', () => {
  let component: LoansEditComponent;
  let fixture: ComponentFixture<LoansEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
