import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecentlyViewedClientListPage } from './recently-viewed-client-list.page';

describe('RecentlyViewedClientListPage', () => {
  let component: RecentlyViewedClientListPage;
  let fixture: ComponentFixture<RecentlyViewedClientListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentlyViewedClientListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentlyViewedClientListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
