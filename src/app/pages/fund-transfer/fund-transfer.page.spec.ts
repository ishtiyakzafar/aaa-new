import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundTransferPage } from './fund-transfer.page';

describe('FundTransferPage', () => {
  let component: FundTransferPage;
  let fixture: ComponentFixture<FundTransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundTransferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FundTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
