import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessagePopup } from './message-popup.component';

describe('MessagePopup', () => {
  let component: MessagePopup;
  let fixture: ComponentFixture<MessagePopup>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePopup ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
