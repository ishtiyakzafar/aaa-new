import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipBookComponent } from './sip-book.component';

describe('SipBookComponent', () => {
  let component: SipBookComponent;
  let fixture: ComponentFixture<SipBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipBookComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
