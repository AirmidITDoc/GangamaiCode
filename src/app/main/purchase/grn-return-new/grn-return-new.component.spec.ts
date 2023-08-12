import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnReturnNewComponent } from './grn-return-new.component';

describe('GrnReturnNewComponent', () => {
  let component: GrnReturnNewComponent;
  let fixture: ComponentFixture<GrnReturnNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnReturnNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnReturnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
