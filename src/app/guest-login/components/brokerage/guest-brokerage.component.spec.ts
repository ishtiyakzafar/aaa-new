import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestBrokerageComponent } from './brokerage.component';

describe('GuestBrokerageComponent', () => {
  let component: GuestBrokerageComponent;
  let fixture: ComponentFixture<GuestBrokerageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestBrokerageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
