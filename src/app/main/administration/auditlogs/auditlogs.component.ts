import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuditlogsService } from './auditlogs.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auditlogs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuditlogsComponent implements OnInit {

  AuditList: any = [];
  DSAuditlogs = new MatTableDataSource<AuditlogsList>();
  pagedAuditLogs: any[] = [];

  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;
  searchText = '';

  myformSearch: FormGroup;

  fromDate = this.datePipe.transform(new Date, "yyyy-MM-dd");
  toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  constructor(
    public _auditlogsService: AuditlogsService,
    public datePipe: DatePipe,
    ) {
  }
  ngOnInit(): void {
    this.myformSearch = this._auditlogsService.createSearchForm();
    this.myformSearch.get('fromDate')?.setValue(this.fromDate)
    this.myformSearch.get('enddate')?.setValue(this.toDate)

    this.onGetList();
    this.totalRecords = this.DSAuditlogs.data.length;
    this.loadPage();
  
  }

  loadPage() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAuditLogs = this.DSAuditlogs.data.slice(start, end);
  }

  onPageChange(event: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadPage();
  }

  getMethod(description: string): string {
    try {
      const data = JSON.parse(description);
      return data.Method || '-';
    } catch {
      return '-';
    }
  }

  onGetList() {
    this.AuditList = [];
    this.DSAuditlogs.data = [];
    const m =
    {
    
      "first": 0,
      "rows": 50,
      // "first": this.pageIndex * this.pageSize,
      // "rows": 50,
      "sortField": "Id",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ActionByName",
          "fieldValue": "",
          "opType": "StartsWith"
        },
        {
          "fieldName": "From_Dt",
          "fieldValue": "2026-09-26",
          "opType": "Equals"
        },
        {
          "fieldName": "To_Dt",
          "fieldValue": "2026-09-26",
          "opType": "Equals"
        }


      ],
      "Columns": [],
      "exportType": "JSON"
    }

    console.log(m);
    this._auditlogsService.AuditLogList(m).subscribe(response => {
      this.AuditList = response.data
      console.log(response.data);
      this.DSAuditlogs.data = this.AuditList;
      this.totalRecords = this.DSAuditlogs.data.length;
      this.loadPage();
    });
  }
}


export class AuditlogsList {
  Id: any;
  ActionId: any;
  ActionById: any;
  ActionByName: any;
  EntityId: any;
  EntityName: any;
  Description: any;
  AdditionalInfo: any;
  LogTypeId: any;
  LogSourceId: any;
  CreatedOn: any;
}