import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestRecentlyViewedClientListPage } from './guest-recently-viewed-client-list.page';

describe('GuestRecentlyViewedClientListPage', () => {
  let component: GuestRecentlyViewedClientListPage;
  let fixture: ComponentFixture<GuestRecentlyViewedClientListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestRecentlyViewedClientListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestRecentlyViewedClientListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
