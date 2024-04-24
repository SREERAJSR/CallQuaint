import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottifyComponent } from './lottify.component';

describe('LottifyComponent', () => {
  let component: LottifyComponent;
  let fixture: ComponentFixture<LottifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LottifyComponent]
    });
    fixture = TestBed.createComponent(LottifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
