import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FutOiGainerLoserPage } from './fut-oi-gainer-loser.page';

describe('FutOiGainerLoserPage', () => {
  let component: FutOiGainerLoserPage;
  let fixture: ComponentFixture<FutOiGainerLoserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutOiGainerLoserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FutOiGainerLoserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
