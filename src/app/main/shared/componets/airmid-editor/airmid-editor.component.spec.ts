import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirmidEditorComponent } from './airmid-editor.component';

describe('AirmidEditorComponent', () => {
  let component: AirmidEditorComponent;
  let fixture: ComponentFixture<AirmidEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirmidEditorComponent]
    });
    fixture = TestBed.createComponent(AirmidEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
