import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { gridModel, gridModel1, gridRequest, gridRequest1, gridResponseType } from 'app/core/models/gridRequest';
import { DATE_TYPES, gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ApiCaller } from 'app/core/services/apiCaller';
import { DatePipe } from '@angular/common';
import { CrossConsultationComponent } from 'app/main/opd/appointment-list/cross-consultation/cross-consultation.component';

@Component({
  selector: 'app-airmid-table1',
  templateUrl: './airmid-table1.component.html',
  styleUrls: ['./airmid-table1.component.scss']
})
export class AirmidTable1Component implements OnInit {

  
  constructor(private _httpClient: ApiCaller, public datePipe: DatePipe,public _matDialog: MatDialog,) {
  }
  dateType = DATE_TYPES;
  @Input() gridConfig1: gridModel;
  @Input() gridConfig: gridModel1; // or whatever type of datasource you have
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  // @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  dataSource = new MatTableDataSource<any>();
  @Input() ShowButtons: boolean = true;
  @Input() FullWidth: boolean = false;
  @Input() ShowFilter: boolean = true;
      @Input() tableClasses: string = '';
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
         // this.updateFilters();
 
         var param1: gridRequest1 = {

            sortField: this.sort?.active ?? this.gridConfig.sortField,
            sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, 
            columns: [],
            first: (this.paginator?.pageIndex ?? 0),
            rows: (this.paginator?.pageSize ?? this.gridConfig.row),
             mode:this.gridConfig.mode,
             searchFields: this.gridConfig.searchFields,
             exportType: gridResponseType.JSON
         };
         this._httpClient.PostData(this.gridConfig.apiUrl, param1).subscribe((data: any) => {
             this.dataSource.data = data.data as [];
             debugger
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
