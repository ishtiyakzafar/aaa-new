import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumMldsPage } from './aum-mlds.page';

describe('AumMldsPage', () => {
  let component: AumMldsPage;
  let fixture: ComponentFixture<AumMldsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumMldsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumMldsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
