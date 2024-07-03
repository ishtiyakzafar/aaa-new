import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FdsMaturingComponent } from './fds-maturing.component';

describe('FdsMaturingComponent', () => {
  let component: FdsMaturingComponent;
  let fixture: ComponentFixture<FdsMaturingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdsMaturingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FdsMaturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
