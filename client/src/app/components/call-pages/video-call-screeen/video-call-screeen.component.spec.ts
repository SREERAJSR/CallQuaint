import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallScreeenComponent } from './video-call-screeen.component';

describe('VideoCallScreeenComponent', () => {
  let component: VideoCallScreeenComponent;
  let fixture: ComponentFixture<VideoCallScreeenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoCallScreeenComponent]
    });
    fixture = TestBed.createComponent(VideoCallScreeenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
