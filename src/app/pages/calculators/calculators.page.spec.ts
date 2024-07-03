import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalculatorsPage } from './calculators.page';

describe('CalculatorsPage', () => {
  let component: CalculatorsPage;
  let fixture: ComponentFixture<CalculatorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
