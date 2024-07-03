import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeekHlPage } from './week-hl.page';

describe('WeekHlPage', () => {
  let component: WeekHlPage;
  let fixture: ComponentFixture<WeekHlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekHlPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeekHlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
