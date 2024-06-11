import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCallRequestComponent } from './incoming-call-request.component';

describe('IncomingCallRequestComponent', () => {
  let component: IncomingCallRequestComponent;
  let fixture: ComponentFixture<IncomingCallRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingCallRequestComponent]
    });
    fixture = TestBed.createComponent(IncomingCallRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
