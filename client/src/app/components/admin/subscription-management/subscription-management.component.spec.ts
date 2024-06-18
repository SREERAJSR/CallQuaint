import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionManagementComponent } from './subscription-management.component';

describe('SubscriptionManagementComponent', () => {
  let component: SubscriptionManagementComponent;
  let fixture: ComponentFixture<SubscriptionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionManagementComponent]
    });
    fixture = TestBed.createComponent(SubscriptionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
