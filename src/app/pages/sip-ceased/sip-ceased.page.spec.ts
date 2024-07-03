import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipCeasedPage } from './sip-ceased.page';

describe('SipCeasedPage', () => {
  let component: SipCeasedPage;
  let fixture: ComponentFixture<SipCeasedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipCeasedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipCeasedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
