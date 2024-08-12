import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdmissionDateChangeService } from './admission-date-change.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IpBillBrowseList } from 'app/main/ipd/ip-bill-browse-list/ip-bill-browse-list.component';

@Component({
  selector: 'app-admission-date-change',
  templateUrl: './admission-date-change.component.html',
  styleUrls: ['./admission-date-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionDateChangeComponent implements OnInit {
  displayedColumns:string[] = [
   
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'BillAmt',
    'ConAmt',
    'NetpayableAmt', 
    'action',
  ];
  

  sIsLoading: string = '';
  isLoading = true;

  dsAdmissionList = new MatTableDataSource<IpBillBrowseList>();

  dateTimeObj: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _AdmissionDateChangeService:AdmissionDateChangeService,
    private _fuseSidebarService: FuseSidebarService, 
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getSearchList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  } 
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  } 
  resultsLength =0;
  getSearchList() {
    debugger
    this.sIsLoading = 'loading-data';
    // var D_data = {
    //   "F_Name": this._AdmissionDateChangeService.UserFormGroup.get("FirstName").value + '%' || "%",
    //   "L_Name": this._AdmissionDateChangeService.UserFormGroup.get("LastName").value + '%' || "%",
    //   "From_Dt": this.datePipe.transform(this._AdmissionDateChangeService.UserFormGroup.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    //   "To_Dt ": this.datePipe.transform(this._AdmissionDateChangeService.UserFormGroup.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    //   "Reg_No": this._AdmissionDateChangeService.UserFormGroup.get("RegNo").value || 0,
    //   "PBillNo": this._AdmissionDateChangeService.UserFormGroup.get("PbillNo").value + '%' || "%",
    //   "Start":(this.paginator?.pageIndex??0),
    //   "Length":(this.paginator?.pageSize??35) 
    // }
    // console.log(D_data);
    // this._AdmissionDateChangeService.getIpBillBrowseList(D_data).subscribe(Visit => {
    //   this.dsAdmissionList.data = Visit as IpBillBrowseList[];
    //   this.dsAdmissionList.data = Visit["Table1"]??[] as IpBillBrowseList[];
    //   console.log(this.dsAdmissionList.data) 
    //   this.resultsLength= Visit["Table"][0]["total_row"];
    //   this.sIsLoading = this.dsAdmissionList.data.length == 0 ? 'no-data' : ''; 
    // },
    //   error => {
    //     this.sIsLoading = '';
    //   });
  }
}

export class AdmissionList{
  RegNo:any;
  PatientName:string;
  BillAmt:number;
  ConAmt: Number;
  NetpayableAmt: number;
  BillDate:number;
  PBillNo:number;

  constructor(PaymentPharmayList) {
    {
      this.RegNo = PaymentPharmayList.RegNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.BillAmt = PaymentPharmayList.BillAmt || 0;
      this.ConAmt = PaymentPharmayList.ConAmt || 0;
      this.NetpayableAmt = PaymentPharmayList.NetpayableAmt || 0;
      this.BillDate = PaymentPharmayList.BillDate || 0;
      this.PBillNo = PaymentPharmayList.PBillNo || 0;   
    }
  }
}
