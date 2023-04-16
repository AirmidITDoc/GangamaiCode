import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseOpListComponent } from './browse-op-list.component';

describe('BrowseOpListComponent', () => {
  let component: BrowseOpListComponent;
  let fixture: ComponentFixture<BrowseOpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseOpListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseOpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
