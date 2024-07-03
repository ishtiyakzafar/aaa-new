import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommonHeaderRevampComponent } from './common-header-revamp.component';

describe('CommonHeaderRevampComponent', () => {
  let component: CommonHeaderRevampComponent;
  let fixture: ComponentFixture<CommonHeaderRevampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonHeaderRevampComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommonHeaderRevampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
