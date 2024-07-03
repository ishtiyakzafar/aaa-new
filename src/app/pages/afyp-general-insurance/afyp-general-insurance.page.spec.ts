import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfypGeneralInsurancePage } from './afyp-general-insurance.page';

describe('AfypGeneralInsurancePage', () => {
  let component: AfypGeneralInsurancePage;
  let fixture: ComponentFixture<AfypGeneralInsurancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfypGeneralInsurancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfypGeneralInsurancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
