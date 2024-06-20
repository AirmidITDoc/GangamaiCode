import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebillDetailsComponent } from './prebill-details.component';

describe('PrebillDetailsComponent', () => {
  let component: PrebillDetailsComponent;
  let fixture: ComponentFixture<PrebillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrebillDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrebillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
