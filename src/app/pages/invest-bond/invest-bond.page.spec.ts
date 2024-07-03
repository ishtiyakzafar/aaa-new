import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestBondPage } from './invest-bond.page';

describe('InvestBondPage', () => {
  let component: InvestBondPage;
  let fixture: ComponentFixture<InvestBondPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestBondPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestBondPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
