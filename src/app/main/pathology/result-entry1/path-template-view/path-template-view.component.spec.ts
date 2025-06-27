import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathTemplateViewComponent } from './path-template-view.component';

describe('PathTemplateViewComponent', () => {
  let component: PathTemplateViewComponent;
  let fixture: ComponentFixture<PathTemplateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathTemplateViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
