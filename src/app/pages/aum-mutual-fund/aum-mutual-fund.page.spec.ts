import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumMutualFundPage } from './aum-mutual-fund.page';

describe('AumMutualFundPage', () => {
  let component: AumMutualFundPage;
  let fixture: ComponentFixture<AumMutualFundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumMutualFundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumMutualFundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
