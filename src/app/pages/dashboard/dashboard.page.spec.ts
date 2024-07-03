import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardRevampPage } from './dashboard.page';

describe('DashboardRevampPage', () => {
  let component: DashboardRevampPage;
  let fixture: ComponentFixture<DashboardRevampPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRevampPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRevampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
