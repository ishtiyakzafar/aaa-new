import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfypGeneralInsuranceComponent } from './afyp-general-insurance.component';

describe('AfypGeneralInsuranceComponent', () => {
  let component: AfypGeneralInsuranceComponent;
  let fixture: ComponentFixture<AfypGeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfypGeneralInsuranceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfypGeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
