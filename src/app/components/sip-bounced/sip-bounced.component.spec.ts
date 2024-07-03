import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipBouncedComponent } from './sip-bounced.component';

describe('SipBouncedComponent', () => {
  let component: SipBouncedComponent;
  let fixture: ComponentFixture<SipBouncedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipBouncedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipBouncedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
