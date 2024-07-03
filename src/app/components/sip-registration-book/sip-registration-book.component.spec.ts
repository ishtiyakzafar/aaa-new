import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipRegistrationBookComponent } from './sip-registration-book.component';

describe('SipRegistrationBookComponent', () => {
  let component: SipRegistrationBookComponent;
  let fixture: ComponentFixture<SipRegistrationBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipRegistrationBookComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipRegistrationBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
