import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayDetailsEquityComponent } from './pay-details-equity.component';

describe('PayDetailsEquityComponent', () => {
  let component: PayDetailsEquityComponent;
  let fixture: ComponentFixture<PayDetailsEquityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDetailsEquityComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayDetailsEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
