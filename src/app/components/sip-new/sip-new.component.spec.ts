import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipNewComponent } from './sip-new.component';

describe('SipNewComponent', () => {
  let component: SipNewComponent;
  let fixture: ComponentFixture<SipNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipNewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
