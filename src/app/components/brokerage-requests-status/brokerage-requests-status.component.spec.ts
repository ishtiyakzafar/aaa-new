import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrokerageRequestsStatusComponent } from './brokerage-requests-status.component';

describe('BrokerageRequestsStatusComponent', () => {
  let component: BrokerageRequestsStatusComponent;
  let fixture: ComponentFixture<BrokerageRequestsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageRequestsStatusComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerageRequestsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
