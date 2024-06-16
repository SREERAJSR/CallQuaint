import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsettingComponent } from './accountsetting.component';

describe('AccountsettingComponent', () => {
  let component: AccountsettingComponent;
  let fixture: ComponentFixture<AccountsettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsettingComponent]
    });
    fixture = TestBed.createComponent(AccountsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
