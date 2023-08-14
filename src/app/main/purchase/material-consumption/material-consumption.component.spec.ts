import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialConsumptionComponent } from './material-consumption.component';

describe('MaterialConsumptionComponent', () => {
  let component: MaterialConsumptionComponent;
  let fixture: ComponentFixture<MaterialConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
