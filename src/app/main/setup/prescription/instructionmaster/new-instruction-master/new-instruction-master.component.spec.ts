import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInstructionMasterComponent } from './new-instruction-master.component';

describe('NewInstructionMasterComponent', () => {
  let component: NewInstructionMasterComponent;
  let fixture: ComponentFixture<NewInstructionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInstructionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInstructionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
