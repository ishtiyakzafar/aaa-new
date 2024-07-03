import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditWatchlistMobileComponent } from './edit-watchlist-mobile.component';

describe('EditWatchlistMobileComponent', () => {
  let component: EditWatchlistMobileComponent;
  let fixture: ComponentFixture<EditWatchlistMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWatchlistMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWatchlistMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
