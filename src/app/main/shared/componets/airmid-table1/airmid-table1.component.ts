import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CrossConsultationComponent } from 'app/main/opd/appointment/cross-consultation/cross-consultation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { gridModel, gridRequest, gridResponseType } from 'app/core/models/gridRequest';
import { DATE_TYPES, gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ApiCaller } from 'app/core/services/apiCaller';
import { EditConsultantDoctorComponent } from 'app/main/opd/appointment/edit-consultant-doctor/edit-consultant-doctor.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-airmid-table1',
  templateUrl: './airmid-table1.component.html',
  styleUrls: ['./airmid-table1.component.scss']
})
export class AirmidTable1Component implements OnInit {

  
  constructor(private _httpClient: ApiCaller, public datePipe: DatePipe,public _matDialog: MatDialog,) {
  }
  dateType = DATE_TYPES;
  @Input() gridConfig: gridModel; // or whatever type of datasource you have
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  // @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  dataSource = new MatTableDataSource<any>();
  // @ViewChild(MatSort) set sort(sort: MatSort) {
  //     this.dataSource.sort = sort;
  // }
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // ngAfterContentInit() {
  //     this.gridConfig.columnsList.forEach(columnDef => this.table.addColumnDef(columnDef));
  // }
  headers = [];
  ngOnInit(): void {
      this.bindGridData();
  }
  public get GridAction() {
      return gridActions;
  }
  public get GridColumnType() {
      return gridColumnTypes;
  }
  public get Headers(){
      return this.gridConfig.columnsList.map(x => x.key.replaceAll(' ', ''));
  }
  bindGridData() {
      var param: gridRequest = {
          sortField: this.sort?.active ?? this.gridConfig.sortField,
          sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, filters: this.gridConfig.filters,
          columns: [],
          first: (this.paginator?.pageIndex ?? 0),
          rows: (this.paginator?.pageSize ?? this.gridConfig.row),
          exportType: gridResponseType.JSON
      };
      this._httpClient.PostData(this.gridConfig.apiUrl, param).subscribe((data: any) => {
          this.dataSource.data = data.data as [];
          this.dataSource.sort = this.sort;
          this.resultsLength = data["recordsFiltered"];
      });
  }
  onClear() {

  }
  getStatus(status: boolean) {
      return status;
  }

  CrossCons(){
      let row=''
      let that = this;
      const dialogRef = this._matDialog.open(CrossConsultationComponent,
          {
              maxWidth: "65vw",
              height: '60%',
              width: '80%',
              data: row
          });
      dialogRef.afterClosed().subscribe(result => {
        
      });
  }
}
