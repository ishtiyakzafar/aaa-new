import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfypLifeInsuranceComponent } from './afyp-life-insurance.component';

describe('AfypLifeInsuranceComponent', () => {
  let component: AfypLifeInsuranceComponent;
  let fixture: ComponentFixture<AfypLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfypLifeInsuranceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfypLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
