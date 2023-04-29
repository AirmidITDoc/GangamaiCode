import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSearchListComponent } from './ip-search-list.component';

describe('IpSearchListComponent', () => {
  let component: IpSearchListComponent;
  let fixture: ComponentFixture<IpSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
