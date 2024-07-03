import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketsPage } from './markets.page';

describe('MarketsPage', () => {
  let component: MarketsPage;
  let fixture: ComponentFixture<MarketsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
