import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumPmsPage } from './aum-pms.page';

describe('AumPmsPage', () => {
  let component: AumPmsPage;
  let fixture: ComponentFixture<AumPmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumPmsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumPmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
