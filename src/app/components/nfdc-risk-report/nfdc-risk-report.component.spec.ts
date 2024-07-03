import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NfdcRiskReportComponent } from './nfdc-risk-report.component';

describe('NfdcRiskReportComponent', () => {
  let component: NfdcRiskReportComponent;
  let fixture: ComponentFixture<NfdcRiskReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NfdcRiskReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NfdcRiskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
