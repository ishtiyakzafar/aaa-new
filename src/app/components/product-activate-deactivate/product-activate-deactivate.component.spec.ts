import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductActivateDeactivateComponent } from './product-activate-deactivate.component';

describe('ProductActivateDeactivateComponent', () => {
  let component: ProductActivateDeactivateComponent;
  let fixture: ComponentFixture<ProductActivateDeactivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductActivateDeactivateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductActivateDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
