import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokerageInformationPage } from './brokerage-information.page';

describe('BrokerageInformationPage', () => {
  let component: BrokerageInformationPage;
  let fixture: ComponentFixture<BrokerageInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerageInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
