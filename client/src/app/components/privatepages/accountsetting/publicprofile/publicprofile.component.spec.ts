import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicprofileComponent } from './publicprofile.component';

describe('PublicprofileComponent', () => {
  let component: PublicprofileComponent;
  let fixture: ComponentFixture<PublicprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicprofileComponent]
    });
    fixture = TestBed.createComponent(PublicprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
