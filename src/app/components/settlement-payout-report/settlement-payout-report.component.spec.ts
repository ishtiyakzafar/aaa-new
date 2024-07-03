import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementPayoutReportComponent } from './settlement-payout-report.component';

describe('SettlementPayoutReportComponent', () => {
  let component: SettlementPayoutReportComponent;
  let fixture: ComponentFixture<SettlementPayoutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettlementPayoutReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettlementPayoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
