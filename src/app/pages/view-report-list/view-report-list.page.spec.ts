import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewReportListPage } from './view-report-list.page';

describe('ViewReportListPage', () => {
  let component: ViewReportListPage;
  let fixture: ComponentFixture<ViewReportListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReportListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewReportListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
