import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MostActiveStockIndexPage } from './most-active-stock-index.page';

describe('MostActiveStockIndexPage', () => {
  let component: MostActiveStockIndexPage;
  let fixture: ComponentFixture<MostActiveStockIndexPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostActiveStockIndexPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MostActiveStockIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
