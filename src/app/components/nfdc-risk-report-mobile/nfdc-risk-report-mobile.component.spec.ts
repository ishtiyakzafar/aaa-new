import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NfdcRiskReportMobileComponent } from './nfdc-risk-report-mobile.component';

describe('NfdcRiskReportMobileComponent', () => {
  let component: NfdcRiskReportMobileComponent;
  let fixture: ComponentFixture<NfdcRiskReportMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NfdcRiskReportMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NfdcRiskReportMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
