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
import { element } from 'protractor';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
  isLoading:''; 
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  noOptionFound:any;
  filteredOptions:any;
  screenFromString = 'pharma-advance';
  vRegNo:any;
  vPatienName:any;
  vMobileNo:any;
  vAdmissionDate:any;
  vAdmissionID:any;
  vIPDNo:any;
  vRoomName:any;
  vTariffName:any;
  vBedName:any;
  vCompanyName:any;
  vDoctorName:any;
  vGenderName:any;
  vAge:any;
  vAgeMonth:any;
  vAgeDay:any;
  vRefDocName:any;
  vDepartment:any;
  vadvanceAmount:any;
  vRegId:any;
  vPatientType:any;

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
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }

  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vRegId= obj.RegID;
   this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
   this.vAdmissionDate = obj.AdmissionDate;
   this.vRoomName = obj.RoomName; 
   this.vAdmissionID = obj.AdmissionID;
   this.vIPDNo = obj.IPDNo
   this.vTariffName = obj.TariffName;
   this.vBedName = obj.BedName;
   this.vCompanyName = obj.CompanyName;
   this.vDoctorName = obj.DoctorName;
   this.vGenderName = obj.GenderName;
   this.vAge = obj.Age
   this.vAgeMonth = obj.AgeMonth
   this.vAgeDay = obj.AgeDay
   this.vRefDocName = obj.RefDocName
   this.getAdvanceList(obj);
  }
  vAdvanceId:any;
  vAdvanceDetailID:any;
  getAdvanceList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionID": obj.AdmissionID
    }
    console.log(m_data) 
      this.sIsLoading = 'loading';
      this._PharAdvanceService.getAdvanceList(m_data).subscribe(Visit => {
        this.dsIpItemList.data = Visit as IpItemList[];
        this.vAdvanceId = this.dsIpItemList.data[0]['AdvanceId'];
        this.vAdvanceDetailID = this.dsIpItemList.data[0].AdvanceDetailID;
        console.log(this.dsIpItemList.data)
        this.dsIpItemList.sort = this.sort;
        this.dsIpItemList.paginator = this.paginator;  
      }); 
  }
 
  // getAdvancetotal(element) {
  //   let netAmt;
  //   netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
  //   this.TotalAdvamt = netAmt;
  //   return netAmt;
  // }

  // getAdvavilable(element) {
  //   let netAmt;
  //   netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
  //   this.Advavilableamt = netAmt;
  //   return netAmt;
  // } 
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  isLoading123 = false;
  onSave() {
    if (this.vadvanceAmount == '' || this.vadvanceAmount == null || this.vadvanceAmount == undefined || this.vadvanceAmount == 0) {
      this.toastr.warning('Please enter advance amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.isLoading123 = true; 
    if (!this.vAdvanceId) {
      let insertPHAdvanceObj = {};
      insertPHAdvanceObj['advanceID'] = 0;
      insertPHAdvanceObj['date'] = this.dateTimeObj.date || '01/01/1900';
      insertPHAdvanceObj['refId'] = this.vRegId || 0;
      insertPHAdvanceObj['opD_IPD_Type'] = 1;
      insertPHAdvanceObj['opD_IPD_Id'] = this.vAdmissionID || 0;
      insertPHAdvanceObj['advanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0;
      insertPHAdvanceObj['advanceUsedAmount'] = 0;
      insertPHAdvanceObj['balanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0;
      insertPHAdvanceObj['addedBy'] = this._loggedService.currentUserValue.user.id;
      insertPHAdvanceObj['isCancelled'] = false;
      insertPHAdvanceObj['isCancelledBy'] = '0';
      insertPHAdvanceObj['isCancelledDate'] = this.dateTimeObj.date || '01/01/1900'

      let insertPHAdvanceDetailobj = {};
      insertPHAdvanceDetailobj['advanceDetailID'] = 0;
      insertPHAdvanceDetailobj['date'] = this.dateTimeObj.date;
      insertPHAdvanceDetailobj['time'] = this.dateTimeObj.time;
      insertPHAdvanceDetailobj['advanceId'] = 0;
      insertPHAdvanceDetailobj['refId'] = this.vRegId || 0;
      insertPHAdvanceDetailobj['transactionId'] = 2;
      insertPHAdvanceDetailobj['opD_IPD_Type'] = 1;
      insertPHAdvanceDetailobj['opD_IPD_Id'] = this.vAdmissionID || 0;
      insertPHAdvanceDetailobj['advanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value;
      insertPHAdvanceDetailobj['usedAmount'] = 0;
      insertPHAdvanceDetailobj['balanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value;
      insertPHAdvanceDetailobj['refundAmount'] = 0;
      insertPHAdvanceDetailobj['reasonOfAdvanceId'] = 0;
      insertPHAdvanceDetailobj['addedBy'] = this._loggedService.currentUserValue.user.id;
      insertPHAdvanceDetailobj['isCancelled'] = false;
      insertPHAdvanceDetailobj['isCancelledBy'] = 0;
      insertPHAdvanceDetailobj['isCancelledDate'] = this.dateTimeObj.date;
      insertPHAdvanceDetailobj['reason'] = this._PharAdvanceService.NewAdvanceForm.get('comment').value || '';
      insertPHAdvanceDetailobj['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;


      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.vIPDNo;
      PatientHeaderObj['PatientName'] = this.vPatienName;
      PatientHeaderObj['UHIDNO'] = this.vRegNo;
      PatientHeaderObj['BillId'] = 0;
      PatientHeaderObj['DoctorName'] = this.vDoctorName;
      PatientHeaderObj['NetPayAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0;

      const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
        {
          maxWidth: "90vw",
          height: '640px',
          width: '70%',

          data: {
            // vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-Pharma-Advance",
            advanceObj: PatientHeaderObj,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('==============================  Advance Amount ===========', result);
       
        let submitData = {
          "insertPHAdvance": insertPHAdvanceObj,
          "insertPHAdvanceDetail": insertPHAdvanceDetailobj,
          "insertPHPayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._PharAdvanceService.InsertIpPharmaAdvance(submitData).subscribe(response => {

          if (response) {
            this.toastr.success('IP Pharma Advance data Saved Successfully !', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            console.log(response)
            this.viewgetIPAdvanceReportPdf(response);
            this._matDialog.closeAll();
            this.isLoading123 = false;
            this.onClose();
          } else {
            this.toastr.success('IP Pharma Advance data not Saved!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.isLoading123 = false;
          }
        });
        this.isLoading123 = false;
      }); 

    }
    else {
      let updatePHAdvanceObj = {};
      updatePHAdvanceObj['advanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0
      updatePHAdvanceObj['balanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0
      updatePHAdvanceObj['advanceId'] = this.vAdvanceId || 0;

      let insertPHAdvanceDetailobj = {};
      insertPHAdvanceDetailobj['advanceDetailID'] = this.vAdvanceDetailID || 0;
      insertPHAdvanceDetailobj['date'] = this.dateTimeObj.date;
      insertPHAdvanceDetailobj['time'] = this.dateTimeObj.time;
      insertPHAdvanceDetailobj['advanceId'] = this.vAdvanceId || 0;
      insertPHAdvanceDetailobj['refId'] = this.vRegId || 0;
      insertPHAdvanceDetailobj['transactionId'] = 2;
      insertPHAdvanceDetailobj['opD_IPD_Type'] = 1;
      insertPHAdvanceDetailobj['opD_IPD_Id'] = this.vAdmissionID || 0;
      insertPHAdvanceDetailobj['advanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value;
      insertPHAdvanceDetailobj['usedAmount'] = 0;
      insertPHAdvanceDetailobj['balanceAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value;
      insertPHAdvanceDetailobj['refundAmount'] = 0;
      insertPHAdvanceDetailobj['reasonOfAdvanceId'] = 0;
      insertPHAdvanceDetailobj['addedBy'] = this._loggedService.currentUserValue.user.id;
      insertPHAdvanceDetailobj['isCancelled'] = false;
      insertPHAdvanceDetailobj['isCancelledBy'] = 0;
      insertPHAdvanceDetailobj['isCancelledDate'] = this.dateTimeObj.date;
      insertPHAdvanceDetailobj['reason'] = this._PharAdvanceService.NewAdvanceForm.get('comment').value || '';
      insertPHAdvanceDetailobj['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;

      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.vIPDNo;
      PatientHeaderObj['PatientName'] = this.vPatienName;
      PatientHeaderObj['UHIDNO'] = this.vRegNo;
      PatientHeaderObj['BillId'] = 0;
      PatientHeaderObj['DoctorName'] = this.vDoctorName;
      PatientHeaderObj['NetPayAmount'] = this._PharAdvanceService.NewAdvanceForm.get('advanceAmt').value || 0;

      const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
        {
          maxWidth: "90vw",
          height: '640px',
          width: '70%',

          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-Pharma-Advance",
            advanceObj: PatientHeaderObj,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('==============================  Advance Amount ===========');

        let submitData = {
          "updatePHAdvance": updatePHAdvanceObj,
          "insertPHAdvanceDetail": insertPHAdvanceDetailobj,
          "insertPHPayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._PharAdvanceService.UpdateIpPharmaAdvance(submitData).subscribe(response => {
          if (response) {
            this.toastr.success('IP Pharma Advance data Updated Successfully !', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            }); 
                this._matDialog.closeAll();
                this.onClose();
                this.viewgetIPAdvanceReportPdf(this.vAdvanceDetailID); 
          } else {
            this.toastr.success('IP Pharma Advance data not Updated !', 'error !', {
              toastClass: 'tostr-tost custom-toast-success',
            });  
          }
          this.isLoading = '';
        });

      });
      setTimeout(() => {
        this.isLoading123 = false;
      }, 2000);
    }

  }


   
viewgetIPAdvanceReportPdf(contact) {
  debugger
  
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
   
  this._PharAdvanceService.getViewPahrmaAdvanceReceipt(
 contact.AdvanceDetailID
  ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Phrama Advance Receipt Viewer"
        }
      });
      matDialog.afterClosed().subscribe(result => {
                this.sIsLoading = '';
      });
  });
 
  },100)
  
}



  onClose(){
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset(){
    this._PharAdvanceService.NewAdvanceForm.reset();
    this._PharAdvanceService.NewAdvanceForm.get('Op_ip_id').setValue('1');
    this.dsIpItemList.data =[];
  }
}
export class IpItemList {
  PatientName: string;
  Date: number;
  AdvanceNo: number;
  UsedAmount: any;
  AdvanceAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  UHIDNo: any;
  CashPay: any;
  ChequePay: any;
  CardPay: any;
  AdvanceId:any;
  OPD_IPD_Id: any;
  NeftPay:any;
  PayTMPay: any;
  UserName:any;
  AdvanceDetailID:any;

  constructor(IpItemList) {
    {
      this.PatientName = IpItemList.PatientName || '';
      this.Date = IpItemList.Date || 0;
      this.AdvanceNo = IpItemList.AdvanceNo || 0;
      this.UHIDNo = IpItemList.UHIDNo || 0;
      this.AdvanceAmount = IpItemList.AdvanceAmount || 0;
      this.UsedAmount = IpItemList.UsedAmount || 0;
      this.BalanceAmount = IpItemList.BalanceAmount || 0;
      this.RefundAmount = IpItemList.RefundAmount || 0;
      this.AdvanceId = IpItemList.AdvanceId || 0;
      this.OPD_IPD_Id = IpItemList.OPD_IPD_Id || 0;
      this.CashPay = IpItemList.CashPay || 0;
      this.ChequePay = IpItemList.ChequePay || 0;
      this.CardPay = IpItemList.CardPay || 0;
      this.NeftPay = IpItemList.NeftPay || 0;
      this.PayTMPay = IpItemList.PayTMPay || 0;
      this.UserName = IpItemList.UserName || '';
    }
  }
}
