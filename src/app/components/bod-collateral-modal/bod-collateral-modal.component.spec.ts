import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BodCollateralModalComponent } from './bod-collateral-modal.component';

describe('BodCollateralModalComponent', () => {
  let component: BodCollateralModalComponent;
  let fixture: ComponentFixture<BodCollateralModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodCollateralModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BodCollateralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
