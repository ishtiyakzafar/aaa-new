import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayDetailsSearchHeaderComponent } from './pay-details-search-header.component';

describe('PayDetailsSearchHeaderComponent', () => {
  let component: PayDetailsSearchHeaderComponent;
  let fixture: ComponentFixture<PayDetailsSearchHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDetailsSearchHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayDetailsSearchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
