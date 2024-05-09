import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallingscreenComponent } from './callingscreen.component';

describe('CallingscreenComponent', () => {
  let component: CallingscreenComponent;
  let fixture: ComponentFixture<CallingscreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallingscreenComponent]
    });
    fixture = TestBed.createComponent(CallingscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
