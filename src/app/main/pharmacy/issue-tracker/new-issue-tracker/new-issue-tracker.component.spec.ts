import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssueTrackerComponent } from './new-issue-tracker.component';

describe('NewIssueTrackerComponent', () => {
  let component: NewIssueTrackerComponent;
  let fixture: ComponentFixture<NewIssueTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIssueTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIssueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
