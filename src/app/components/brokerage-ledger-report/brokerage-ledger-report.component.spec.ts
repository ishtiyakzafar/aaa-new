import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokerageLedgerReportComponent } from './brokerage-ledger-report.component';

describe('BrokerageLedgerReportComponent', () => {
  let component: BrokerageLedgerReportComponent;
  let fixture: ComponentFixture<BrokerageLedgerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageLedgerReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerageLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
