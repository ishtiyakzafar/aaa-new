import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DpScriptPayoutMobileComponent } from './dp-script-payout-mobile.component';

describe('DpScriptPayoutMobileComponent', () => {
  let component: DpScriptPayoutMobileComponent;
  let fixture: ComponentFixture<DpScriptPayoutMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpScriptPayoutMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DpScriptPayoutMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
