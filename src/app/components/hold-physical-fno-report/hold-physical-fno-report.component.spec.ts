import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HoldPhysicalFnoReportComponent } from './hold-physical-fno-report.component';

describe('HoldPhysicalFnoReportComponent', () => {
  let component: HoldPhysicalFnoReportComponent;
  let fixture: ComponentFixture<HoldPhysicalFnoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldPhysicalFnoReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HoldPhysicalFnoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
