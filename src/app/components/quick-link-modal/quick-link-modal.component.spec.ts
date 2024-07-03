import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLinkModalComponent } from './quick-link-modal.component';

describe('QuickLinkModalComponent', () => {
  let component: QuickLinkModalComponent;
  let fixture: ComponentFixture<QuickLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickLinkModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
