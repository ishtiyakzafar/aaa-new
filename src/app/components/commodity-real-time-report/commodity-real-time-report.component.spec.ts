import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommodityRealTimeReportComponent } from './commodity-real-time-report.component';

describe('CommodityRealTimeReportComponent', () => {
  let component: CommodityRealTimeReportComponent;
  let fixture: ComponentFixture<CommodityRealTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityRealTimeReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommodityRealTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
