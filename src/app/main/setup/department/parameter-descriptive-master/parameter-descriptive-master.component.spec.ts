import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDescriptiveMasterComponent } from './parameter-descriptive-master.component';

describe('ParameterDescriptiveMasterComponent', () => {
  let component: ParameterDescriptiveMasterComponent;
  let fixture: ComponentFixture<ParameterDescriptiveMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterDescriptiveMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDescriptiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
