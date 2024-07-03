import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientEquityCommodityPage } from './client-equity-commodity.page';

describe('ClientEquityCommodityPage', () => {
  let component: ClientEquityCommodityPage;
  let fixture: ComponentFixture<ClientEquityCommodityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEquityCommodityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEquityCommodityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
