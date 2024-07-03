import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HoldPhysicalFnoReportMobileComponent } from './hold-physical-fno-report-mobile.component';

describe('HoldPhysicalFnoReportMobileComponent', () => {
  let component: HoldPhysicalFnoReportMobileComponent;
  let fixture: ComponentFixture<HoldPhysicalFnoReportMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldPhysicalFnoReportMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HoldPhysicalFnoReportMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
