import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DischargeCancelService } from './discharge-cancel.service';

@Component({
  selector: 'app-discharge-cancel',
  templateUrl: './discharge-cancel.component.html',
  styleUrls: ['./discharge-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DischargeCancelComponent implements OnInit {

  displayedColumns = [ 
    'RegNo',
    'PatientName',
    'DOA', 
    'Doctorname',
    'RefDocName',
    'IPNo',
    'PatientType',
    'WardName',
    'TariffName',
    'ClassName',
    'CompanyName',
    'RelativeName', 
    'Action'
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsDischargeList =new MatTableDataSource<DischargeList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _DischargeCancelService: DischargeCancelService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getAdmittedPatientList_1(){

  }
  onClear(){

  }
}
export class DischargeList{
  InvoiceNo: any;
  InvoiceDate: any;
  CustomerId: string;
  Amount: string;
  InvoiceRaisedId: any;
  constructor(DischargeList) {
    {
      this.InvoiceNo = DischargeList.InvoiceNo || 0;
      this.InvoiceDate = DischargeList.InvoiceDate || 0;
      this.CustomerId = DischargeList.CustomerId || '';
      this.Amount = DischargeList.Amount || '';
      this.InvoiceRaisedId = DischargeList.InvoiceRaisedId || 0;
    }
  }
}
