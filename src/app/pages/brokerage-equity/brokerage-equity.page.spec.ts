import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokerageEquityPage } from './brokerage-equity.page';

describe('BrokerageEquityPage', () => {
  let component: BrokerageEquityPage;
  let fixture: ComponentFixture<BrokerageEquityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageEquityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerageEquityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
