import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestDashboardRevampPage } from './guest-dashboard.page';

describe('GuestDashboardRevampPage', () => {
  let component: GuestDashboardRevampPage;
  let fixture: ComponentFixture<GuestDashboardRevampPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestDashboardRevampPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestDashboardRevampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
