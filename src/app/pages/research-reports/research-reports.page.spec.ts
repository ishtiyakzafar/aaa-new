import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResearchReportsPage } from './research-reports.page';

describe('ResearchReportsPage', () => {
  let component: ResearchReportsPage;
  let fixture: ComponentFixture<ResearchReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResearchReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
