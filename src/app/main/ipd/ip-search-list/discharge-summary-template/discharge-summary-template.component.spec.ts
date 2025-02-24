import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeSummaryTemplateComponent } from './discharge-summary-template.component';

describe('DischargeSummaryTemplateComponent', () => {
  let component: DischargeSummaryTemplateComponent;
  let fixture: ComponentFixture<DischargeSummaryTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DischargeSummaryTemplateComponent]
    });
    fixture = TestBed.createComponent(DischargeSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
