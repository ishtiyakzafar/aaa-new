import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipLivePage } from './sip-live.page';

describe('SipLivePage', () => {
  let component: SipLivePage;
  let fixture: ComponentFixture<SipLivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipLivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipLivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
