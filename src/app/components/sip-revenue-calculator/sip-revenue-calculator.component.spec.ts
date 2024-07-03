import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipRevenueCalculatorComponent } from './sip-revenue-calculator.component';

describe('SipRevenueCalculatorComponent', () => {
  let component: SipRevenueCalculatorComponent;
  let fixture: ComponentFixture<SipRevenueCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipRevenueCalculatorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipRevenueCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
