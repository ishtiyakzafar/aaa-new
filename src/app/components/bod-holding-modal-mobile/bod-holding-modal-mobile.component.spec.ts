import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BodHoldingModalMobileComponent } from './bod-holding-modal-mobile.component';

describe('BodHoldingModalMobileComponent', () => {
  let component: BodHoldingModalMobileComponent;
  let fixture: ComponentFixture<BodHoldingModalMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodHoldingModalMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BodHoldingModalMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
