import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerGrnlistForAccountComponent } from './retailer-grnlist-for-account.component';

describe('RetailerGrnlistForAccountComponent', () => {
  let component: RetailerGrnlistForAccountComponent;
  let fixture: ComponentFixture<RetailerGrnlistForAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailerGrnlistForAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerGrnlistForAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
