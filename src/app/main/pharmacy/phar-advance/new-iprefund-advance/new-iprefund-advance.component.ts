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
import Swal from 'sweetalert2';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';


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
    //'AdvanceNo', 
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount', 
    'PrevRefundAmount'
  ];

  dateTimeObj: any;
  sIsLoading: string = ''; 
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
  dsPreRefundList =  new MatTableDataSource<IpItemList>();

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
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
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
    this.getRefundAdvanceList(obj)
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
  
  getRefundAdvanceList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionId": obj.AdmissionID
    }
    console.log(m_data)
    setTimeout(() => {
      this.sIsLoading = 'loading';
      this._PharAdvanceService.getRefundAdvanceList(m_data).subscribe(Visit => {
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
  onEdit(row) { 
    console.log(row); 
    // this.BalanceAdvance = 0;
    // this.RefundAmount = 0;
    // this.UsedAmount = row.UsedAmount;
    this.advanceId = row.AdvanceId;
    // this.advDetailId = row.AdvanceDetailID;
    // this.BalanceAmount = row.BalanceAmount;
    
    //this.NewRefundAmount = 0;
    console.log(row);
    let Query = "select RefundDate,RefundAmount from t_PhRefund where AdvanceId=" + row.AdvanceId
    
    this._PharAdvanceService.getPreRefundofAdvance(Query).subscribe(Visit => {
      this.dsPreRefundList.data =  Visit as IpItemList[]; 
      console.log(this.dsPreRefundList.data); 
    });  
  }
  
  getCellCalculation(element, RefundAmt) {

    if (RefundAmt > 0 && RefundAmt <= element.NetBalAmt) {
      element.BalanceAmount = ((element.NetBalAmt) - (RefundAmt));
    }
    else if (parseInt(RefundAmt) > parseInt(element.NetBalAmt)) {
      this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      element.RefundAmount = ''
      element.BalanceAmount = element.NetBalAmt;
    }
    else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null) {
      element.RefundAmount = ''
      element.BalanceAmount = element.NetBalAmt;
    }
  }


  getAdvaceSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.vBalanceAmount = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0).toFixed(2);;
    this.vToatalRefunfdAmt = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0).toFixed(2);; 
    return netAmt;
  }
 
  BalanceAmount:any;
  advanceId:any; 
  onSave() { 
    if(this.vRegNo  == '' || this.vRegNo == null || this.vRegNo == undefined || this.vRegNo == '0'){
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    if(this.vToatalRefunfdAmt == '' || this.vToatalRefunfdAmt == null || this.vToatalRefunfdAmt == undefined || this.vToatalRefunfdAmt == '0'){
      this.toastr.warning('Please enter refund amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } 
      this.sIsLoading = 'submit'; 
      let insertPharRefundofAdvance = {};
      insertPharRefundofAdvance['refundDate'] = this.dateTimeObj.date || '01/01/1900'
      insertPharRefundofAdvance['refundTime'] = this.dateTimeObj.time || '01/01/1900'
      insertPharRefundofAdvance['billId'] = 0;
      insertPharRefundofAdvance['advanceId'] = this.advanceId || 0;
      insertPharRefundofAdvance['opD_IPD_ID'] = this.vAdmissionID;
      insertPharRefundofAdvance['opD_IPD_Type'] = 1;
      insertPharRefundofAdvance['refundAmount'] = parseFloat(this._PharAdvanceService.NewRefundForm.get('ToatalRefunfdAmt').value) || 0;
      insertPharRefundofAdvance['remark'] =  this._PharAdvanceService.NewRefundForm.get('comment').value || '';
      insertPharRefundofAdvance['transactionId'] =9;
      insertPharRefundofAdvance['addedBy'] =  this._loggedService.currentUserValue.userId;
      insertPharRefundofAdvance['isCancelled'] = false;
      insertPharRefundofAdvance['isCancelledBy'] = 0;
      insertPharRefundofAdvance['isCancelledDate'] ='01/01/1900';
      insertPharRefundofAdvance['strId'] =  this._loggedService.currentUserValue.storeId || 0;
      insertPharRefundofAdvance['refundId'] = 0; 
 
        let updatePharAdvanceHeaderobj = {};
        updatePharAdvanceHeaderobj['advanceId'] =this.advanceId || 0;
        updatePharAdvanceHeaderobj['advanceUsedAmount'] = 0;
        updatePharAdvanceHeaderobj['balanceAmount'] = parseFloat(this.vBalanceAmount) || 0;
 

      let insertPharRefundofAdvanceDetail = [];
      this.dsIpItemList.data.forEach((element) =>{
        let insertPharRefundofAdvanceDetailobj = {};
        insertPharRefundofAdvanceDetailobj['advDetailId'] =element.AdvanceDetailID || 0;
        insertPharRefundofAdvanceDetailobj['refundDate'] = this.dateTimeObj.date || '01/01/1900';
        insertPharRefundofAdvanceDetailobj['refundTime'] = this.dateTimeObj.time || '01/01/1900';
        insertPharRefundofAdvanceDetailobj['advRefundAmt'] = element.RefundAmount | 0;
        insertPharRefundofAdvanceDetail.push(insertPharRefundofAdvanceDetailobj) 
      }); 

      let updatePharAdvanceDetailBalAmount = [];
      this.dsIpItemList.data.forEach((element) =>{
        let updatePharAdvanceDetailBalAmountobj = {}; 
        updatePharAdvanceDetailBalAmountobj['advanceDetailID'] =element.AdvanceDetailID || 0;
        updatePharAdvanceDetailBalAmountobj['balanceAmount'] = element.BalanceAmount || 0;
        updatePharAdvanceDetailBalAmountobj['refundAmount'] = element.RefundAmount || 0;
        updatePharAdvanceDetailBalAmount.push(updatePharAdvanceDetailBalAmountobj) 
      }); 

      let PatientHeaderObj = {};
      // PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      // PatientHeaderObj['OPD_IPD_Id'] = this.vAdmissionID;
      // PatientHeaderObj['PatientName'] =  this.vPatienName
      // PatientHeaderObj['NetPayAmount'] = this._PharAdvanceService.NewRefundForm.get('ToatalRefunfdAmt').value || 0;
      // PatientHeaderObj['BillId'] = 0;
      // PatientHeaderObj['UHIDNO'] = this.vRegNo;
      // PatientHeaderObj['DoctorName'] = this.vDoctorName;
      // PatientHeaderObj['OPD_IPD_Id'] = this.vIPDNo;

      //   const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
      //     {
      //       maxWidth: "90vw",
      //       height: '640px',
      //       width: '70%', 
      //       data: {
      //         //vPatientHeaderObj: PatientHeaderObj,
      //         FromName: "IP-Pharma-Refund",
      //         advanceObj: PatientHeaderObj,
      //       }
      //     });

        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['PatientName'] =  this.vPatienName
        PatientHeaderObj['RegNo'] =this.vRegNo;
        PatientHeaderObj['DoctorName'] =this.vDoctorName;
        PatientHeaderObj['CompanyName'] = this.vCompanyName; 
        PatientHeaderObj['OPD_IPD_Id'] =  this.vIPDNo;
        PatientHeaderObj['Age'] =   this.vAge ;
        PatientHeaderObj['NetPayAmount'] =parseInt(this._PharAdvanceService.NewRefundForm.get('ToatalRefunfdAmt').value) || 0;
          const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
              maxWidth: "80vw",
              height: '650px',
              width: '80%',
              data: {
                vPatientHeaderObj: PatientHeaderObj,
                FromName: "IP-Pharma-Refund",
                advanceObj: PatientHeaderObj,
              }
            });
        dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Refung Amount ===========',result);
          // console.log(result.submitDataPay.ipPaymentInsert);
          // console.log(result.submitDataPay);
          let submitData = {
            "insertPharRefundofAdvance": insertPharRefundofAdvance,
            "updatePharAdvanceHeader": updatePharAdvanceHeaderobj,
            "insertPharRefundofAdvanceDetail":insertPharRefundofAdvanceDetail,
            "updatePharAdvanceDetailBalAmount":updatePharAdvanceDetailBalAmount,
            "insertPharPayment":  result.submitDataPay.ipPaymentInsert
 
          };
          console.log(submitData);
          this._PharAdvanceService.InsertRefundOfAdv(submitData).subscribe(response => {

            if (response) {
              this.toastr.success('IP Pharma Refund Of Advance data Saved Successfully !', 'Saved !', {
                toastClass: 'tostr-tost custom-toast-success',
              });  
                  this.viewgetRefundofAdvanceReportPdf(response);
                  this.OnReset();
                  this._matDialog.closeAll();  
            } else {
              this.toastr.success('IP Pharma Refund Of Advance data not Saved!', 'Error!', {
                toastClass: 'tostr-tost custom-toast-success',
              });    
            } 
          });

        });  
        
  }

  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this._PharAdvanceService.NewRefundForm.reset();
    this._PharAdvanceService.NewRefundForm.get('Op_ip_id').setValue(1);
    this.dsIpItemList.data = [];
    this._PharAdvanceService.NewRefundForm.get('RegID').setValue('')
  }

  viewgetRefundofAdvanceReportPdf(contact) {
       
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
     
    this._PharAdvanceService.getViewPahrmaRefundAdvanceReceipt(
   contact
    ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pharma Refund Of Advance Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => {
                  this.sIsLoading = '';
        });
    });
   
    },100)
    
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
}
  export class IpItemList {
   
    AdvanceNo: number;
    PreviousRef: number;
    BalanceAmount: any;
    UsedAmount: any;
    AdvanceAmount: any;
    Date:any;
    RefundAmount:any;
    AdvanceDetailID:any;
    PrevRefundAmount:any;
 
    constructor(IpItemList) {
      { 
        this.AdvanceAmount = IpItemList.AdvanceAmount || 0;
        this.UsedAmount = IpItemList.UsedAmount || 0;
        this.PrevRefundAmount = IpItemList.PrevRefundAmount || 0;
        this.BalanceAmount = IpItemList.BalanceAmount || 0;
        this.AdvanceNo = IpItemList.AdvanceNo || 0; 
        this.PreviousRef = IpItemList.PreviousRef || 0; 
        this.RefundAmount = IpItemList.RefundAmount || 0;
        this.Date = IpItemList.Date || 0;
        this.AdvanceDetailID = IpItemList.AdvanceDetailID || 0;
      }
    }
  }
 

