import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoreRevampPage } from './more-menu.page';

describe('MoreRevampPage', () => {
  let component: MoreRevampPage;
  let fixture: ComponentFixture<MoreRevampPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreRevampPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MoreRevampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
