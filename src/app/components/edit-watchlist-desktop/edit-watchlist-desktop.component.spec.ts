import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditWatchlistDesktopComponent } from './edit-watchlist-desktop.component';

describe('EditWatchlistDesktopComponent', () => {
  let component: EditWatchlistDesktopComponent;
  let fixture: ComponentFixture<EditWatchlistDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWatchlistDesktopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWatchlistDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
