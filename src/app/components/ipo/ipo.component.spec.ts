import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IpoComponent } from './ipo.component';

describe('IpoComponent', () => {
  let component: IpoComponent;
  let fixture: ComponentFixture<IpoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
