import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPmsAifLeadComponent } from './guest-pms-aif-lead.component';

describe('GuestPmsAifLeadComponent', () => {
  let component: GuestPmsAifLeadComponent;
  let fixture: ComponentFixture<GuestPmsAifLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestPmsAifLeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestPmsAifLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
