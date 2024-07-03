import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { YourKpiModalComponent } from './your-kpi-modal.component';

describe('YourKpiModalComponent', () => {
  let component: YourKpiModalComponent;
  let fixture: ComponentFixture<YourKpiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourKpiModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourKpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
