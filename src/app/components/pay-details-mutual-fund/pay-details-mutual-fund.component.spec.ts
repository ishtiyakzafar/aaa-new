import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayDetailsMutualFundComponent } from './pay-details-mutual-fund.component';

describe('PayDetailsMutualFundComponent', () => {
  let component: PayDetailsMutualFundComponent;
  let fixture: ComponentFixture<PayDetailsMutualFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDetailsMutualFundComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayDetailsMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
