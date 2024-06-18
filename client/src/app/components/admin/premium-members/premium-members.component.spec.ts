import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumMembersComponent } from './premium-members.component';

describe('PremiumMembersComponent', () => {
  let component: PremiumMembersComponent;
  let fixture: ComponentFixture<PremiumMembersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumMembersComponent]
    });
    fixture = TestBed.createComponent(PremiumMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
