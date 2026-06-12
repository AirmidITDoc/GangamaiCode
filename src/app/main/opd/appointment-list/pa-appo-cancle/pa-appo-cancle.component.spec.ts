import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaAppoCancleComponent } from './pa-appo-cancle.component';

describe('PaAppoCancleComponent', () => {
  let component: PaAppoCancleComponent;
  let fixture: ComponentFixture<PaAppoCancleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaAppoCancleComponent]
    });
    fixture = TestBed.createComponent(PaAppoCancleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
