import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpSearchListComponent } from './op-search-list.component';

describe('OpSearchListComponent', () => {
  let component: OpSearchListComponent;
  let fixture: ComponentFixture<OpSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
