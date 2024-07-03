import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumEquityPage } from './aum-equity.page';

describe('AumEquityPage', () => {
  let component: AumEquityPage;
  let fixture: ComponentFixture<AumEquityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumEquityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumEquityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
