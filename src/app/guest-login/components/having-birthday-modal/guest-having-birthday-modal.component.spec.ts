import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHavingBirthdayModalComponent } from './guest-having-birthday-modal.component';

describe('GuestHavingBirthdayModalComponent', () => {
  let component: GuestHavingBirthdayModalComponent;
  let fixture: ComponentFixture<GuestHavingBirthdayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestHavingBirthdayModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestHavingBirthdayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
