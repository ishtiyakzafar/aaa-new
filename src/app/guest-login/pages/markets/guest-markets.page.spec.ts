import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestMarketsPage } from './guest-markets.page';

describe('GuestMarketsPage', () => {
  let component: GuestMarketsPage;
  let fixture: ComponentFixture<GuestMarketsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestMarketsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestMarketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
