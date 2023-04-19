import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdSearchListComponent } from './opd-search-list.component';

describe('OpdSearchListComponent', () => {
  let component: OpdSearchListComponent;
  let fixture: ComponentFixture<OpdSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
