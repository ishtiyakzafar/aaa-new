import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhysicalFnoSuccessModalMobileComponent } from './physical-fno-success-modal-mobile.component';

describe('PhysicalFnoSuccessModalMobileComponent', () => {
  let component: PhysicalFnoSuccessModalMobileComponent;
  let fixture: ComponentFixture<PhysicalFnoSuccessModalMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalFnoSuccessModalMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalFnoSuccessModalMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
