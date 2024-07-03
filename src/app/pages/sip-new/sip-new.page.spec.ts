import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SipNewPage } from './sip-new.page';

describe('SipNewPage', () => {
  let component: SipNewPage;
  let fixture: ComponentFixture<SipNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SipNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
