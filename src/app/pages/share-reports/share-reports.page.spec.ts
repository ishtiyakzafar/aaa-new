import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareReportsPage } from './share-reports.page';

describe('ShareReportsPage', () => {
  let component: ShareReportsPage;
  let fixture: ComponentFixture<ShareReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
