import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestNotInvestInSipComponent } from './guest-not-invest-in-sip.component';

describe('GuestNotInvestInSipComponent', () => {
  let component: GuestNotInvestInSipComponent;
  let fixture: ComponentFixture<GuestNotInvestInSipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestNotInvestInSipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestNotInvestInSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
