import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PharAdvanceService } from '../phar-advance.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-new-advance',
  templateUrl: './new-advance.component.html',
  styleUrls: ['./new-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewAdvanceComponent implements OnInit {
  displayedColumns = [
    'Date',
    'AdvanceNo',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount',
    'CashPay',
    'ChequePay',
    'CardPay',
    'NeftPay',
    'PayTMPay',
    'UserName',
    'buttons' 
  ];

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  noOptionFound:any;
  filteredOptions:any;
  
  vRegNo:any;
  vPatienName:any;
  vMobileNo:any;
  vAdmissionDate:any;
  vAdmissionID:any;
  vIPDNo:any;

  dsIpItemList = new MatTableDataSource<IpItemList>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _PharAdvanceService:PharAdvanceService, 
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe, 
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewAdvanceComponent>,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this._PharAdvanceService.NewAdvanceForm.get('RegID').value}%`
    }
    if (this._PharAdvanceService.NewAdvanceForm.get('RegID').value.length >= 1) {
      this._PharAdvanceService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
   this.vAdmissionDate = obj.AdmissionDate;
   this.vMobileNo = obj.MobileNo; 
   this.vAdmissionID = obj.AdmissionID;
   this.vIPDNo = obj.IPDNo
   this.getAdvanceList(obj);
  }
  getAdvanceList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionID": obj.AdmissionID
    }
    setTimeout(() => {
      this.sIsLoading = 'loading';
      this._PharAdvanceService.getAdvanceList(m_data).subscribe(Visit => {
        this.dsIpItemList.data = Visit as IpItemList[];
        if (this.dsIpItemList.data.length > 0) { 
          this.dsIpItemList.sort = this.sort;
          this.dsIpItemList.paginator = this.paginator; 
        }
        else { 
          this.sIsLoading = this.dsIpItemList.data.length == 0 ? 'no-data' : '';
        }
      },
        error => {
          this.sIsLoading = this.dsIpItemList.data.length == 0 ? 'no-data' : '';
        });
    }, 500);

  }
  TotalAdvamt:any;
  Advavilableamt:any;
  vadvanceAmount:any;
  vPatientType:any;
  getAdvancetotal(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.TotalAdvamt = netAmt;
    return netAmt;
  }

  getAdvavilable(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.Advavilableamt = netAmt;
    return netAmt;
  }
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onSave(){ 
      // debugger
      // if (this.vAdvanceId == 0) {
      //   this.isLoading = 'submit';
  
      //   let advanceHeaderObj = {};
      //   advanceHeaderObj['AdvanceId'] = 0;
      //   advanceHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      //   advanceHeaderObj['RefId'] = this.selectedAdvanceObj.RegId,
      //     advanceHeaderObj['OPD_IPD_Type'] = 1;
      //   advanceHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      //   advanceHeaderObj['AdvanceAmount'] = this.advanceAmount;
      //   advanceHeaderObj['AdvanceUsedAmount'] = 0;
      //   advanceHeaderObj['BalanceAmount'] = this.advanceAmount;
      //   advanceHeaderObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      //   advanceHeaderObj['IsCancelled'] = false;
      //   advanceHeaderObj['IsCancelledBy'] = '0';
      //   advanceHeaderObj['IsCancelledDate'] = '01/01/1900';
  
      //   let AdvanceDetObj = {};
      //   AdvanceDetObj['AdvanceDetailID'] = '0';
      //   AdvanceDetObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      //   AdvanceDetObj['Time'] = this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900'
      //   AdvanceDetObj['AdvanceId'] = 0;
      //   AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId,
      //     AdvanceDetObj['transactionID'] = 2;
      //   AdvanceDetObj['OPD_IPD_Type'] = 1;
      //   AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      //   AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      //   AdvanceDetObj['usedAmount'] = 0;
      //   AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      //   AdvanceDetObj['RefundAmount'] = 0;
      //   AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      //   AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      //   AdvanceDetObj['IsCancelled'] = false;
      //   AdvanceDetObj['IsCancelledBy'] = 0;
      //   AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      //   AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
      //   // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;
      //   debugger
      //   let PatientHeaderObj = {};
      //   PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      //   PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      //   PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      //   PatientHeaderObj['NetPayAmount'] = this.advanceAmount;
      //   PatientHeaderObj['BillId'] = 0;
   
      //     const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
      //       {
      //         maxWidth: "90vw",
      //         height: '640px',
      //         width: '100%',
  
      //         data: {
      //           vPatientHeaderObj: PatientHeaderObj,
      //           FromName: "Advance",
      //           advanceObj: PatientHeaderObj,
      //         }
      //       });
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('==============================  Advance Amount ===========');
      //       let submitData = {
      //         "advanceHeaderInsert": advanceHeaderObj,
      //         "advanceDetailInsert": AdvanceDetObj,
      //         "ipPaymentInsert": result.submitDataPay.ipPaymentInsert
      //       };
      //       console.log(submitData);
      //       this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {
  
      //         if (response) {
      //           Swal.fire('Congratulations !', 'IP Advance data saved Successfully !', 'success').then((result) => {
      //             if (result.isConfirmed) {
      //               this.viewgetAdvanceReceiptReportPdf(response);
  
      //               this._matDialog.closeAll();
      //             }
      //           });
      //         } else {
      //           Swal.fire('Error !', 'IP Advance data not saved', 'error');
      //         }
      //         this.isLoading = '';
      //       });
  
      //     }); 
  
      // }
      // else {
      //   this.isLoading = 'submit';
  
      //   let AdvanceDetObj = {};
      //   AdvanceDetObj['AdvanceDetailID'] = '0';
      //   AdvanceDetObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      //   AdvanceDetObj['Time'] = this.dateTimeObj.time || '01/01/1900'
      //   AdvanceDetObj['AdvanceId'] = this.vAdvanceId || 0;
      //   AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegId;
      //   AdvanceDetObj['transactionID'] = 2;
      //   AdvanceDetObj['OPD_IPD_Type'] = 1;
      //   AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      //   AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      //   AdvanceDetObj['AdvanceUsedAmount'] = 0;
      //   AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      //   AdvanceDetObj['RefundAmount'] = 0;
      //   AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      //   AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      //   AdvanceDetObj['IsCancelled'] = false;
      //   AdvanceDetObj['IsCancelledBy'] = 0;
      //   AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      //   AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
      //   // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;
  
      //   let advanceHeaderObj = {};
      //   advanceHeaderObj['AdvanceId'] = this.vAdvanceId;
      //   advanceHeaderObj['AdvanceAmount'] = parseInt(this.advanceAmount.toString());
  
      //   let PatientHeaderObj = {};
  
      //   PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      //   PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      //   PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      //   PatientHeaderObj['NetPayAmount'] = this.advanceAmount;
  
      //   const advanceHeaderUpdate = new AdvanceHeaderUpdate(advanceHeaderObj);
      //   const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);
        
      //     const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
      //       {
      //         maxWidth: "75vw",
      //         height: '75vh',
      //         width: '100%',
  
      //         data: {
      //           vPatientHeaderObj: PatientHeaderObj,
      //           FromName: "Advance",
      //           advanceObj: PatientHeaderObj,
      //         }
      //       });
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('==============================  Advance Amount ===========');
  
      //       let submitData = {
      //         "advanceHeaderUpdate": advanceHeaderUpdate,
      //         "advanceDetailInsert1": advanceDetailInsert,
      //         "ipPaymentInsert1": result.submitDataPay.ipPaymentInsert
      //       };
      //       console.log(submitData);
      //       this._IpSearchListService.InsertAdvanceHeaderUpdate(submitData).subscribe(response => {
      //         if (response) {
      //           Swal.fire('Congratulations !', 'IP Advance data Updated Successfully !', 'success').then((result) => {
      //             if (result.isConfirmed) {
      //               this.getAdvanceList();
      //               this._matDialog.closeAll();
      //               this.viewgetAdvanceReceiptReportPdf(response);
      //               // this.getPrint(response);
      //             }
      //           });
      //         } else {
      //           Swal.fire('Error !', 'IP Advance data not Updated', 'error');
      //         }
      //         this.isLoading = '';
      //       });
  
      //     });
       
  
      // }
      // this.AdvFormGroup.get('advanceAmt').reset(0);
      // this.AdvFormGroup.get('comment').reset('');
      // this.AdvFormGroup.get('CashCounterId').reset(0);
 
  }
  onClose(){
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset(){
    this._PharAdvanceService.NewAdvanceForm.reset();
    this._PharAdvanceService.NewAdvanceForm.get('Op_ip_id').setValue(1);
    this.dsIpItemList.data =[];
  }
}
export class IpItemList {

  ItemName: string;
  BatchNo: number;
  Expdate: number;
  Qty: string;
  MRP: number;
  TotalMRP: number;
  GSTAmount: number;
  CGST: any;
  SGST: any;
  IGST: any;

  constructor(IpItemList) {
    {
      this.ItemName = IpItemList.ItemName || '';
      this.BatchNo = IpItemList.BatchNo || 0;
      this.Expdate = IpItemList.Expdate || 0;
      this.Qty = IpItemList.Qty || 0;
      this.MRP = IpItemList.MRP || 0;
      this.TotalMRP = IpItemList.TotalMRP || 0;
      this.GSTAmount = IpItemList.GSTAmount || 0;
      this.CGST = IpItemList.CGST || 0;
      this.SGST = IpItemList.SGST || 0;
      this.IGST = IpItemList.IGST || 0;
    }
  }
}
