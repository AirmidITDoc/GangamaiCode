import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssueTodeptComponent } from './new-issue-todept.component';

describe('NewIssueTodeptComponent', () => {
  let component: NewIssueTodeptComponent;
  let fixture: ComponentFixture<NewIssueTodeptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewIssueTodeptComponent]
    });
    fixture = TestBed.createComponent(NewIssueTodeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
