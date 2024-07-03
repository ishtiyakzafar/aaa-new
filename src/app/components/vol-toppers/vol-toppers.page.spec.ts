import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VolToppersPage } from './vol-toppers.page';

describe('VolToppersPage', () => {
  let component: VolToppersPage;
  let fixture: ComponentFixture<VolToppersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolToppersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VolToppersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
