import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CancellationService } from './cancellation.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CancellationComponent implements OnInit {
  displayedColumns:string[] = [
   
    'RegNo',
    'PatientName',
    'BillAmt',
    'ConAmt',
    'NetpayableAmt',
    'BillDate',
    'PBillNo',
    'action',
  ];
  

  sIsLoading: string = '';
  isLoading = true;

  dsCancellation = new MatTableDataSource<CancellationList>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _CancellationService:CancellationService,
    private _fuseSidebarService: FuseSidebarService, 
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getSalesList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getSalesList() { 
    this.sIsLoading = 'loading-data';
    var vdata = {
      F_Name: this._CancellationService.UserFormGroup.get('FirstName').value || '%',
      L_Name: this._CancellationService.UserFormGroup.get('LastName').value || '%',
      From_Dt: this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      To_Dt: this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      Reg_No: this._CancellationService.UserFormGroup.get('RegNo').value || 0,
      SalesNo: this._CancellationService.UserFormGroup.get('SalesNo').value || 0,
      OP_IP_Type: this._CancellationService.UserFormGroup.get('OP_IP_Type').value,
      StoreId:  this._loggedService.currentUserValue.user.storeId || 0,
      IPNo:  0 
    }
    //console.log(vdata); 
    setTimeout(() => {
    this.sIsLoading = '';
      this.sIsLoading = '';
      this._CancellationService.getSalesList(vdata).subscribe(data => { 
        this.dsCancellation.data = data as CancellationList[];
        console.log(this.dsCancellation.data);
        this.dsCancellation.sort = this.sort;
        this.dsCancellation.paginator = this.paginator; 
        this.sIsLoading = this.dsCancellation.data.length == 0 ? 'no-data' : '';
        this.sIsLoading = ''; 
      },
        error => {
          this.sIsLoading = '';
        });
    }, 1000); 
  } 

}
export class CancellationList{
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
