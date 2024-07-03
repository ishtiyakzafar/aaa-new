import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExposureListComponent } from './exposure-list.component';

describe('ExposureListComponent', () => {
  let component: ExposureListComponent;
  let fixture: ComponentFixture<ExposureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExposureListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExposureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
