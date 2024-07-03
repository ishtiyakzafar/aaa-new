import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestFixedDepositPage } from './invest-fixed-deposit.page';

describe('InvestFixedDepositPage', () => {
  let component: InvestFixedDepositPage;
  let fixture: ComponentFixture<InvestFixedDepositPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestFixedDepositPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestFixedDepositPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
