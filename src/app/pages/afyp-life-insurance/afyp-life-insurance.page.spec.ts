import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfypLifeInsurancePage } from './afyp-life-insurance.page';

describe('AfypLifeInsurancePage', () => {
  let component: AfypLifeInsurancePage;
  let fixture: ComponentFixture<AfypLifeInsurancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfypLifeInsurancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfypLifeInsurancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
