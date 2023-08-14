import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnReturnWithoutgrnComponent } from './grn-return-withoutgrn.component';

describe('GrnReturnWithoutgrnComponent', () => {
  let component: GrnReturnWithoutgrnComponent;
  let fixture: ComponentFixture<GrnReturnWithoutgrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnReturnWithoutgrnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnReturnWithoutgrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
