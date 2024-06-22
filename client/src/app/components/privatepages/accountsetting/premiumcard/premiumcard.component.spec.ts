import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumcardComponent } from './premiumcard.component';

describe('PremiumcardComponent', () => {
  let component: PremiumcardComponent;
  let fixture: ComponentFixture<PremiumcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumcardComponent]
    });
    fixture = TestBed.createComponent(PremiumcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
