import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PharAdvanceService } from './phar-advance.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NewAdvanceComponent } from './new-advance/new-advance.component';
import { NewIPRefundAdvanceComponent } from './new-iprefund-advance/new-iprefund-advance.component';

@Component({
  selector: 'app-phar-advance',
  templateUrl: './phar-advance.component.html',
  styleUrls: ['./phar-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PharAdvanceComponent implements OnInit {
  displayedColumns = [
    'Date',
    'AdvanceNo',
    'RegNo',
    'PatientName',
    'AdvanceAmount',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'UserName',
    'Action1'
  ];
  displayedColumnsRef = [
    'RefundDate',
    'RefundNo',
    'RegNo',
    'PatientName',
    'RefundAmount',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'Remark',
    'AddedBy', 
    'Action1',
  ];

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;

  dsIPAdvanceList = new MatTableDataSource<IPAdvanceList>();
  dsIPAdvanceRefundList = new MatTableDataSource<IPAdvanceRefList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;

  constructor(
    public _PharAdvanceService:PharAdvanceService, 
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe, 
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getIPAdvanceList();
    this.getIPAdvanceRefundList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  } 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getIPAdvanceList() {
    var Param = {
      "From_Dt": this.datePipe.transform(this._PharAdvanceService.SearchGroupForm.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._PharAdvanceService.SearchGroupForm.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "F_Name": this._PharAdvanceService.SearchGroupForm.get("F_Name").value + '%' || "%",
      "L_Name": this._PharAdvanceService.SearchGroupForm.get("L_Name").value + '%' || "%",
      "Reg_No": this._PharAdvanceService.SearchGroupForm.get("RegNo").value ||  0,
      "PBillNo": this._PharAdvanceService.SearchGroupForm.get("AdvanceNo").value || '0',
      "StoreId":  this._loggedService.currentUserValue.user.storeId || 0
    }
    console.log(Param)
    this._PharAdvanceService.getIPAdvanceList(Param).subscribe(data => {
      this.dsIPAdvanceList.data = data as IPAdvanceList[];
      console.log(this.dsIPAdvanceList.data)
      this.dsIPAdvanceList.sort = this.sort;
      this.dsIPAdvanceList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClear(){
    this._PharAdvanceService.SearchGroupForm.reset();
  }

  getIPAdvanceRefundList() {
    var Param = {
      "From_Dt": this.datePipe.transform(this._PharAdvanceService.SearchRefundForm.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._PharAdvanceService.SearchRefundForm.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "F_Name": this._PharAdvanceService.SearchRefundForm.get("F_Name").value + '%' || "%",
      "L_Name": this._PharAdvanceService.SearchRefundForm.get("L_Name").value + '%' || "%",
      "Reg_No": this._PharAdvanceService.SearchRefundForm.get("RegNo").value ||  0,
      "StoreId":  this._loggedService.currentUserValue.user.storeId || 0
    }
    console.log(Param)
    this._PharAdvanceService.getIPAdvanceRefList(Param).subscribe(data => {
      this.dsIPAdvanceRefundList.data = data as IPAdvanceRefList[];
      console.log(this.dsIPAdvanceRefundList.data)
      this.dsIPAdvanceRefundList.sort = this.sort;
      this.dsIPAdvanceRefundList.paginator = this.Secondpaginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClearRefund(){
    this._PharAdvanceService.SearchRefundForm.reset();
  }
  newAdvance(){
    const dialogRef = this._matDialog.open(NewAdvanceComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%' 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIPAdvanceList();
    }); 
  }
  newAdvanceRef(){
    const dialogRef = this._matDialog.open(NewIPRefundAdvanceComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%' 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIPAdvanceRefundList();
    }); 
  }
}
export class IPAdvanceList {

  Date: any;
  AdvanceNo: number;
  RegNo: number;
  PatientName: string;
  AdvanceAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: any;
  UserName: any;
  IGST: any;

  constructor(IPAdvanceList) {
    {
      this.Date = IPAdvanceList.Date || 0;
      this.AdvanceNo = IPAdvanceList.AdvanceNo || 0;
      this.RegNo = IPAdvanceList.RegNo || 0;
      this.PatientName = IPAdvanceList.PatientName || '';
      this.AdvanceAmount = IPAdvanceList.AdvanceAmount || 0;
      this.CashPayAmount = IPAdvanceList.CashPayAmount || 0;
      this.ChequePayAmount = IPAdvanceList.ChequePayAmount || 0;
      this.CardPayAmount = IPAdvanceList.CardPayAmount || 0;
      this.UserName = IPAdvanceList.UserName || '';
      this.IGST = IPAdvanceList.IGST || 0;
    }
  } 
}
export class IPAdvanceRefList {
 
  RefundDate: any;
  RefundNo: any;
  RegNo: any;
  PatientName: string;
  RefundAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: any;
  Remark: any;
  AddedBy: any;

  constructor(IPAdvanceRefList) {
    {
      this.RefundDate = IPAdvanceRefList.RefundDate || 0;
      this.RefundNo = IPAdvanceRefList.RefundNo || 0;
      this.RegNo = IPAdvanceRefList.RegNo || 0;
      this.PatientName = IPAdvanceRefList.PatientName || '';
      this.RefundAmount = IPAdvanceRefList.RefundAmount || 0;
      this.CashPayAmount = IPAdvanceRefList.CashPayAmount || 0;
      this.ChequePayAmount = IPAdvanceRefList.ChequePayAmount || 0;
      this.CardPayAmount = IPAdvanceRefList.CardPayAmount || 0;
      this.Remark = IPAdvanceRefList.Remark || '';
      this.AddedBy = IPAdvanceRefList.AddedBy || '';
    }
  }
}
