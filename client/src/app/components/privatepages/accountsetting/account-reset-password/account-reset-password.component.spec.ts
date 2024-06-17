import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResetPasswordComponent } from './account-reset-password.component';

describe('AccountResetPasswordComponent', () => {
  let component: AccountResetPasswordComponent;
  let fixture: ComponentFixture<AccountResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountResetPasswordComponent]
    });
    fixture = TestBed.createComponent(AccountResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
