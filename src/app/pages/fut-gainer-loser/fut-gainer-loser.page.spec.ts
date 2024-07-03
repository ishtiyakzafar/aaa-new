import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FutGainerLoserPage } from './fut-gainer-loser.page';

describe('FutGainerLoserPage', () => {
  let component: FutGainerLoserPage;
  let fixture: ComponentFixture<FutGainerLoserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutGainerLoserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FutGainerLoserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
