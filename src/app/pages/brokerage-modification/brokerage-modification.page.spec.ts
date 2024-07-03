import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokerageModificationPage } from './brokerage-modification.page';

describe('BrokerageModificationPage', () => {
  let component: BrokerageModificationPage;
  let fixture: ComponentFixture<BrokerageModificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageModificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerageModificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
