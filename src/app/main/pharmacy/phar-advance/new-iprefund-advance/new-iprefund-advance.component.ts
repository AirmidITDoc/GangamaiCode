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
  selector: 'app-new-iprefund-advance',
  templateUrl: './new-iprefund-advance.component.html',
  styleUrls: ['./new-iprefund-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIPRefundAdvanceComponent implements OnInit {
  displayedColumns1 = [
    'Date',
    'RefundAmount' 
  ];
  displayedColumns = [
    'Date', 
    'AdvanceNo', 
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount', 
  ];

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected: boolean = false;
  PatientListfilteredOptionsref: any;
  screenFromString = 'pharma-refund';
  noOptionFound: any;
  filteredOptions: any;
  vToatalRefunfdAmt:any;
  vBalanceAmount:any;
  vRegNo: any;
  vPatienName: any;
  vMobileNo: any;
  vAdmissionDate: any;
  vAdmissionID: any;
  vIPDNo: any; 
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
  // dsRefIpItemList = new MatTableDataSource<IpRefItemList>();
  dsPreRefundList =  new MatTableDataSource<IpRefItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;

  constructor(
    public _PharAdvanceService: PharAdvanceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIPRefundAdvanceComponent>,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getRefSearchList() {
    var m_data = {
      "Keyword": `${this._PharAdvanceService.NewRefundForm.get('RegID').value}%`
    }
    if (this._PharAdvanceService.NewRefundForm.get('RegID').value.length >= 1) {
      this._PharAdvanceService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptionsref = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionTextref(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj) {
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
  }
  // getAdvanceOldList(obj) { 
  //   let strSql = "select AdmissionId,DOA,IPDNo,AdmittedDr from lvwAdmissionListWithRegNoForPhar where RegNo = " + this.vRegNo + " order by AdmissionId desc"
  //   this._PharAdvanceService.getAdvanceOldList(strSql).subscribe(data => {
  //     this.dsRefIpItemList.data = data as any;
  //     console.log(this.dsRefIpItemList.data)
  //     this.dsRefIpItemList.sort = this.sort;
  //     this.dsRefIpItemList.paginator = this.Secondpaginator;
  //   });   
  // }
  
  getAdvanceList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionId": obj.AdmissionId
    }
    console.log(m_data)
    setTimeout(() => {
      this.sIsLoading = 'loading';
      this._PharAdvanceService.getAdvanceList(m_data).subscribe(Visit => {
        this.dsIpItemList.data = Visit as IpItemList[];
        console.log(this.dsIpItemList.data)
        if (this.dsIpItemList.data.length > 0) {
          this.dsIpItemList.sort = this.sort;
          this.dsIpItemList.paginator = this.Secondpaginator;
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
 
  getAdvancetotal(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.vToatalRefunfdAmt = netAmt;
    return netAmt;
  }

  getAdvavilable(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.vBalanceAmount = netAmt;
    return netAmt;
  }
  getRefundSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0); 
    return netAmt;
  }
  getAdvaceSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0); 
    return netAmt;
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onSave() {
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
  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this._PharAdvanceService.NewAdvanceForm.reset();
    this._PharAdvanceService.NewAdvanceForm.get('Op_ip_id').setValue(1);
    this.dsIpItemList.data = [];
  }
}
  export class IpItemList {
   
    AdvanceNo: number;
    PreviousRef: number;
    BalanceAmount: any;
    UsedAmount: any;
    AdvanceAmount: any;
    Date:any;
    RefundAmount:any;
 
    constructor(IpItemList) {
      { 
        this.AdvanceAmount = IpItemList.AdvanceAmount || 0;
        this.UsedAmount = IpItemList.UsedAmount || 0;
        this.BalanceAmount = IpItemList.BalanceAmount || 0;
        this.AdvanceNo = IpItemList.AdvanceNo || 0; 
        this.PreviousRef = IpItemList.PreviousRef || 0; 
        this.RefundAmount = IpItemList.RefundAmount || 0;
        this.Date = IpItemList.Date || 0;
      }
    }
  }
  export class IpRefItemList {
  
    DoctorName: string;
    AddmissionDate: number;
    IPDNO: number; 

    constructor(IpRefItemList) {
      {
        this.DoctorName = IpRefItemList.DoctorName || '';
        this.AddmissionDate = IpRefItemList.AddmissionDate || 0;
        this.IPDNO = IpRefItemList.IPDNO || 0; 
      }
    }
  }

