import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipCeasedComponent } from './sip-ceased.component';

describe('SipCeasedComponent', () => {
  let component: SipCeasedComponent;
  let fixture: ComponentFixture<SipCeasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipCeasedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipCeasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
