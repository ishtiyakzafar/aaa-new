import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumMutualFundComponent } from './aum-mutual-fund.component';

describe('AumMutualFundComponent', () => {
  let component: AumMutualFundComponent;
  let fixture: ComponentFixture<AumMutualFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumMutualFundComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
