import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesService } from './paymentmodechanges.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditPaymentmodeComponent } from '../paymentmodechangesfor-pharmacy/edit-paymentmode/edit-paymentmode.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DateUpdateComponent } from './date-update/date-update.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paymentmodechanges',
  templateUrl: './paymentmodechanges.component.html',
  styleUrls: ['./paymentmodechanges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesComponent implements OnInit {
  
  gridConfig: any;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    gridConfigOP: gridModel = {
        apiUrl: "Payment/PaymentPharmacyList",
        columnsList: [
            { heading: "PayDate", key: "PaymentDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHIDNo ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PaidAmount", key: "paidamount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NEFTPay", key: "neftpayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PayATM", key: "payTmamount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PaymentmodechangesService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
          { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
          { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
          { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
          { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
          { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
        ],
        row: 10
    }

    // IP Receipt

    gridConfigIP: gridModel = {
      apiUrl: "MReportConfig/List",
      columnsList: [
          { heading: "PayDate", key: "paydate", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ReceiptNo", key: "receiptno", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UHIDNo ", key: "uhidno", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
          { heading: "PaidAmount", key: "paidamount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CashAmount", key: "cashamount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ChequeAmount", key: "chequeamount", sort: true, align: 'left', emptySign: 'NA'},
          { heading: "CardAmount", key: "cardamount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "NEFTPay", key: "neftpay", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PayATM", key: "payatm", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this._PaymentmodechangesService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                              this.toastr.success(response.message);
                              this.grid.bindGridData();
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "ReportName",
      sortOrder: 0,
      filters: [
          { fieldName: "reportName", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }

  // IP Advance

  gridConfigIPAdv: gridModel = {
    apiUrl: "MReportConfig/List",
    columnsList: [
        { heading: "PayDate", key: "paydate", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReceiptNo", key: "receiptno", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHIDNo ", key: "uhidno", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "PaidAmount", key: "paidamount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CashAmount", key: "cashamount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ChequeAmount", key: "chequeamount", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "CardAmount", key: "cardamount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "NEFTPay", key: "neftpay", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PayATM", key: "payatm", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._PaymentmodechangesService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "ReportName",
    sortOrder: 0,
    filters: [
        { fieldName: "reportName", fieldValue: "", opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}
 
  sIsLoading: string = '';
  isLoading = true;

 dsPaymentChanges = new MatTableDataSource<PaymentChange>();
 
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangesService:PaymentmodechangesService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getsearchList(); 

    this.gridConfig = this.gridConfigOP;

    this._PaymentmodechangesService.UseFormGroup.get('Radio')?.valueChanges.subscribe((value) => {
      if (value === '0') {
        this.gridConfig = this.gridConfigOP;
      } else if (value === '1') {
        this.gridConfig = this.gridConfigIP;
      } else if (value === '2') {
        this.gridConfig = this.gridConfigIPAdv;
      }
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    // const dialogRef = this._matDialog.open( NewcreateUserComponent, 
    //     {
    //         maxHeight: '95vh',
    //         width: '90%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         that.grid.bindGridData();
    //     }
    // });
}
  getsearchList(){
    if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '0'){
      this.getOPReceiptList();
    }else if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '1'){
      this.getIPReceiptList();
    }else{
      this.getIPAdvanceList();
    }
  }
 getOPReceiptList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || 0,
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || 0
  }
  console.log(vdata);
  this._PaymentmodechangesService.getOpReceiptList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }

 getIPReceiptList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || '%',
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || '%'
  }
  console.log(vdata);
  this._PaymentmodechangesService.getIpReceiptList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }

 getIPAdvanceList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || 0,
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || 0
  }
  console.log(vdata);
  this._PaymentmodechangesService.getIpAdvanceList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }
 onEdit(m) {
  console.log(m)
  let xx = {
    UserId: m.UserId,
    FirstName: m.FirstName,
    LastName: m.LastName,
    UserLoginName: m.UserLoginName,
    IsActive: m.IsActive,
    AddedBy: m.AddedBy,
    RoleName: m.RoleName,
    RoleId: m.RoleId,
    UserName: m.UserName,
    StoreId: m.StoreId,
    StoreName: m.StoreName,
    IsDoctorType: m.IsDoctorType,
    DoctorID: m.DoctorID,
    DoctorName: m.DoctorName,
    IsPOVerify: m.IsPOVerify,
    IsGRNVerify: m.IsGRNVerify,
    IsCollection: m.IsCollection,
    IsBedStatus: m.IsBedStatus,
    IsCurrentStk: m.IsCurrentStk,
    IsPatientInfo: m.IsPatientInfo,
    IsDateInterval: m.IsDateInterval,
    IsDateIntervalDays: m.IsDateIntervalDays,
    MailId: m.MailId,
    MailDomain: m.MailDomain,
    AddChargeIsDelete: m.AddChargeIsDelete,
    IsIndentVerify: m.IsIndentVerify,
    IsInchIndVfy: m.IsInchIndVfy,
  };
  // this.advanceDataStored.storage = new PaymentPharmayList(xx);
  const dialogRef = this._matDialog.open(EditPaymentmodeComponent,
    { 
      height: "85%",
      width: '75%',
      data: {
        registerObj: m,
        FromName: "IP-PaymentModeChange"
      },
      
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
    if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '0')
      this.getOPReceiptList();
    else if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '1')
      this.getIPReceiptList();
    else 
      this.getIPAdvanceList(); 
  });  
}
PaymentDate(contact){ 
    const dialogRef = this._matDialog.open(DateUpdateComponent,
      { 
        height: "35%",
        width: '35%',
        data: { 
          obj:contact.PaymentId 
        }, 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
     if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '0')
      this.getOPReceiptList();
    else if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '1')
      this.getIPReceiptList();
    else 
      this.getIPAdvanceList();
    });   
}
         


}
export class PaymentChange{
  PayDate:any;
  BillNo:any ;
  RegNo:number;
  PatientName:string;
  BillAmt:any;
  PaidAmt:any ;
  CashAmt:number;
  ChequeAmt:any ;
  CardAmt:number;
  User:any;

 constructor(PaymentChange){
  {
    this.PayDate = PaymentChange.PayDate || 0;
      this.BillNo = PaymentChange.BillNo || 0;
      this.RegNo = PaymentChange.RegNo || 0;
      this.PatientName = PaymentChange.PatientName || "";
      this.BillAmt = PaymentChange.BillAmt || 0;
      this.PaidAmt = PaymentChange.PaidAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.User = PaymentChange.User || '';
  }
 }

}
