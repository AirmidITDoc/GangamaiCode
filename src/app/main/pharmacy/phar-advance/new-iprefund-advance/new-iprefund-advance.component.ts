import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { PharAdvanceService } from '../phar-advance.service';


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
  vAdmissionTime: any;
  regObj: any;

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
 getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.regObj = obj
      console.log("Admitted patient:", this.regObj)
      this.vPatienName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vAdmissionTime = obj.admissionTime
      this.vAdmissionID = obj.admissionID;
      this.getRefundAdvanceList(obj);
    }
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
    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue":String(obj.AdmissionID),// "40917"
          "opType": "Equals"
        }

      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(m_data)

    this._PharAdvanceService.getRefundAdvanceList(m_data).subscribe(Visit => {
      this.dsIpItemList.data = Visit.data as IpItemList[];
      console.log(this.dsIpItemList.data)
      if (this.dsIpItemList.data.length > 0) {
        this.dsIpItemList.sort = this.sort;
        this.dsIpItemList.paginator = this.Secondpaginator;
      }
    });
  }

  // shoe 2nd table data
  onEdit(row) { 
    console.log(row); 
     var m_data = {
  "first": 0,
  "rows": 10,
  "sortField": "AdvanceId",
  "sortOrder": 0,
  "filters": [
    {
      "fieldName": "AdvanceId",
      "fieldValue": String(row.AdvanceId), //"10086"
      "opType": "Contains"
    }
  ],
  "exportType": "JSON",
  "columns": []
}
    console.log(m_data)
    this.advanceId = row.AdvanceId;
    this._PharAdvanceService.getPreRefundofAdvance(m_data).subscribe(Visit => {
      this.dsPreRefundList.data =  Visit.data as IpItemList[]; 
      console.log(this.dsPreRefundList.data); 
    });  
  }
  
  getCellCalculation(element, RefundAmt) {
    debugger

    if (RefundAmt > 0 && RefundAmt <= element.netBalAmt) {
      element.balanceAmount = ((element.netBalAmt) - (RefundAmt));
    }
    else if (parseInt(RefundAmt) > parseInt(element.netBalAmt)) {
      this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      element.refundAmount = ''
      element.balanceAmount = element.netBalAmt;
    }
    else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null) {
      element.refundAmount = ''
      element.balanceAmount = element.netBalAmt;
    }
  }


  getAdvaceSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { advanceAmount }) => sum += +(advanceAmount || 0), 0);
    this.vBalanceAmount = element.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0).toFixed(2);;
    this.vToatalRefunfdAmt = element.reduce((sum, { refundAmount }) => sum += +(refundAmount || 0), 0).toFixed(2);; 
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
        insertPharRefundofAdvanceDetailobj['advDetailId'] =element.advanceDetailId || 0;
        insertPharRefundofAdvanceDetailobj['refundDate'] = this.dateTimeObj.date || '01/01/1900';
        insertPharRefundofAdvanceDetailobj['refundTime'] = this.dateTimeObj.time || '01/01/1900';
        insertPharRefundofAdvanceDetailobj['advRefundAmt'] = element.refundAmount | 0;
        insertPharRefundofAdvanceDetail.push(insertPharRefundofAdvanceDetailobj) 
      }); 

      let updatePharAdvanceDetailBalAmount = [];
      this.dsIpItemList.data.forEach((element) =>{
        let updatePharAdvanceDetailBalAmountobj = {}; 
        updatePharAdvanceDetailBalAmountobj['advanceDetailID'] =element.advanceDetailId || 0;
        updatePharAdvanceDetailBalAmountobj['balanceAmount'] = element.balanceAmount || 0;
        updatePharAdvanceDetailBalAmountobj['refundAmount'] = element.refundAmount || 0;
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
    refundAmount:any;
    AdvanceDetailID:any;
    PrevRefundAmount:any;
    prevRefundAmount:any;
    advanceDetailId:any;
    balanceAmount:any;
 
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
        this.refundAmount = IpItemList.refundAmount || 0;
        this.prevRefundAmount = IpItemList.prevRefundAmount || 0;
        this.advanceDetailId = IpItemList.advanceDetailId || 0;
        this.balanceAmount = IpItemList.balanceAmount || 0;
      }
    }
  }
 

