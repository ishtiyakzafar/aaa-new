import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhysicalFnoConfirmModalMobileComponent } from './physical-fno-confirm-modal-mobile.component';

describe('PhysicalFnoConfirmModalMobileComponent', () => {
  let component: PhysicalFnoConfirmModalMobileComponent;
  let fixture: ComponentFixture<PhysicalFnoConfirmModalMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalFnoConfirmModalMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalFnoConfirmModalMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
