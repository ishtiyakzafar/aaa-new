import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PremiumDiscountPage } from './premium-discount.page';

describe('PremiumDiscountPage', () => {
  let component: PremiumDiscountPage;
  let fixture: ComponentFixture<PremiumDiscountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumDiscountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PremiumDiscountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
