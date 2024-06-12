import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceCallScreenComponent } from './voice-call-screen.component';

describe('VoiceCallScreenComponent', () => {
  let component: VoiceCallScreenComponent;
  let fixture: ComponentFixture<VoiceCallScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoiceCallScreenComponent]
    });
    fixture = TestBed.createComponent(VoiceCallScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
