import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipBouncedPage } from './sip-bounced.page';

describe('SipBouncedPage', () => {
  let component: SipBouncedPage;
  let fixture: ComponentFixture<SipBouncedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipBouncedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipBouncedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
