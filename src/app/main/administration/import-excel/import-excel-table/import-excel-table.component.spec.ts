import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelTableComponent } from './import-excel-table.component';

describe('ImportExcelTableComponent', () => {
  let component: ImportExcelTableComponent;
  let fixture: ComponentFixture<ImportExcelTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportExcelTableComponent]
    });
    fixture = TestBed.createComponent(ImportExcelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
