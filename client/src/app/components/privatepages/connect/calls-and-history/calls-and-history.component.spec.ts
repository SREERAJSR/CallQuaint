import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsAndHistoryComponent } from './calls-and-history.component';

describe('CallsAndHistoryComponent', () => {
  let component: CallsAndHistoryComponent;
  let fixture: ComponentFixture<CallsAndHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallsAndHistoryComponent]
    });
    fixture = TestBed.createComponent(CallsAndHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
