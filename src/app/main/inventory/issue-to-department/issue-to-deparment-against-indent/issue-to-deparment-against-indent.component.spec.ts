import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueToDeparmentAgainstIndentComponent } from './issue-to-deparment-against-indent.component';

describe('IssueToDeparmentAgainstIndentComponent', () => {
  let component: IssueToDeparmentAgainstIndentComponent;
  let fixture: ComponentFixture<IssueToDeparmentAgainstIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueToDeparmentAgainstIndentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueToDeparmentAgainstIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
