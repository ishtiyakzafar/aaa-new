import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GainersLosersPage } from './gainers-losers.page';

describe('GainersLosersPage', () => {
  let component: GainersLosersPage;
  let fixture: ComponentFixture<GainersLosersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainersLosersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GainersLosersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
