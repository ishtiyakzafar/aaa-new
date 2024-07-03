import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaydetailModelComponent } from './paydetail-model.component';

describe('PaydetailModelComponent', () => {
  let component: PaydetailModelComponent;
  let fixture: ComponentFixture<PaydetailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydetailModelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaydetailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
