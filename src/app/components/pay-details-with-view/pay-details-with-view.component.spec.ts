import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayDetailsWithViewComponent } from './pay-details-with-view.component';

describe('PayDetailsWithViewComponent', () => {
  let component: PayDetailsWithViewComponent;
  let fixture: ComponentFixture<PayDetailsWithViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDetailsWithViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayDetailsWithViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
