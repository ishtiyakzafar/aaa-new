import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MutualFundProductsMoreComponent } from './mutual-fund-products-more.component';

describe('MutualFundProductsMoreComponent', () => {
  let component: MutualFundProductsMoreComponent;
  let fixture: ComponentFixture<MutualFundProductsMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundProductsMoreComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MutualFundProductsMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
