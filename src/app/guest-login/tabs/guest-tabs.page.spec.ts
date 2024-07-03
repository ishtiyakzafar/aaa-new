import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTabsPage } from './guest-tabs.page';

describe('GuestTabsPage', () => {
  let component: GuestTabsPage;
  let fixture: ComponentFixture<GuestTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestTabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
