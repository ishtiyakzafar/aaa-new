import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmcReportComponent } from './amc-report.component';

describe('AmcReportComponent', () => {
  let component: AmcReportComponent;
  let fixture: ComponentFixture<AmcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmcReportComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});