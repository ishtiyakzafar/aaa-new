import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfypHealthInsurancePage } from './afyp-health-insurance.page';

describe('AfypHealthInsurancePage', () => {
  let component: AfypHealthInsurancePage;
  let fixture: ComponentFixture<AfypHealthInsurancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfypHealthInsurancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfypHealthInsurancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
