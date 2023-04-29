import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpBrowseListComponent } from './ip-browse-list.component';

describe('IpBrowseListComponent', () => {
  let component: IpBrowseListComponent;
  let fixture: ComponentFixture<IpBrowseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpBrowseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpBrowseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
