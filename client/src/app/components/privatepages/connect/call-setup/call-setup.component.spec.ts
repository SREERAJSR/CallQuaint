import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallSetupComponent } from './call-setup.component';

describe('CallSetupComponent', () => {
  let component: CallSetupComponent;
  let fixture: ComponentFixture<CallSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallSetupComponent]
    });
    fixture = TestBed.createComponent(CallSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
