import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MutualFundHoldingsComponent } from './mutual-fund-holdings.component';

describe('MutualFundHoldingsComponent', () => {
  let component: MutualFundHoldingsComponent;
  let fixture: ComponentFixture<MutualFundHoldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundHoldingsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MutualFundHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
