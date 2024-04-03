import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { IPSearchListService } from '../ip-search-list.service';
import Swal from 'sweetalert2';
import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ip-refundof-advance',
  templateUrl: './ip-refundof-advance.component.html',
  styleUrls: ['./ip-refundof-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofAdvanceComponent implements OnInit {

  icon_disable=false;
  screenFromString = 'refund-of-advance';
  RefundOfAdvanceFormGroup: FormGroup;
  dateTimeObj: any;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount: number;
  RefundBalAmount: number;
  BillDate: Date;
  RefundAmount: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAdvance: number = 0;
  NewRefundAmount :number = 0;
  TotRefundAmount :number = 0;
  BalanceAmount: number = 0;
  Remark: string;
  isLoading: string = '';
  isLoadingStr: string = '';
  AdmissionId: number;
  advId: any;
  AdvanceId: any;
  pay_balance_Data: any;
  advDetailId:any;
  AdvanceDetailID: any;
  
  printTemplate: any;
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  subscriptionArr: Subscription[] = [];
  displayedColumns = [
    'Date',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount',
    'AdvanceId'
    // 'action'
  ];
  dataSource = new MatTableDataSource<IPRefundofAdvance>();
 

  displayedColumns1 = [
    'RefundDate',
    // 'AdvanceAmount',
    // 'UsedAmount',
    // 'BalanceAmount',
    'RefundAmount',
    // 'AdvanceId'
    // // 'action'
  ];
  dataSource1 = new MatTableDataSource<IPRefundofAdvance>();
 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 // @Input() BalanceData : number;
  @Input() dataArray: any;
  currentDate = new Date();
  selectedAdvanceObj: AdvanceDetailObj;

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private dialogRef: MatDialogRef<IPRefundofAdvanceComponent>,
    private formBuilder: FormBuilder) { 
      dialogRef.disableClose = true;
    }


  ngOnInit(): void {
    this.RefundOfAdvanceFormGroup = this.formBuilder.group({
      advanceAmt: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      UsedAmount: [''],
      TotalRefundAmount: [''],
      RefundAmount: [0,Validators.required],
      BalanceAmount: ['',Validators.required],
      BalanceAdvance:[0,Validators.required],
      AdvanceDetailID:[''],
      NewRefundAmount:['0'],
      Remark: ['']
    });

  
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }
   
    this.getRefundofAdvanceList();
    this.getReturndetails();
  }


  getRefundtotSum1(element){
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
    this.TotRefundAmount=netAmt1;
    console.log(netAmt1);
  }


  getReturndetails() {
    // debugger
    var m_data = {
    "OPIPID": 32//this.selectedAdvanceObj.AdmissionID
    }
    // debugger;
    // this.dataSource1.data = [];
    this.isLoading = 'list-loading';
    // let Query = "Select AdvanceId from T_AdvanceHeader where  OPD_IPD_Id=" + this.AdmissionId + " ";
    this._IpSearchListService.getReturndetails(m_data).subscribe(data => {
    // this._IpSearchListService.getReturndetails(Query).subscribe(data => {
      // this.AdvanceId = data;
      this.dataSource1.data = data as IPRefundofAdvance[];

      console.log(this.dataSource1.data);
    });
  }

  getRefundofAdvanceList() {
    var m_data = {
      "RefundId": 97317//xthis._IpSearchListService.myRefundAdvanceForm.get("RefundId").value || "0",
    }
    this.isLoadingStr = 'loading';
    this._IpSearchListService.getRefundofAdvanceList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as IPRefundofAdvance[];
     
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  populateForm2(employee) {
    this.RefundOfAdvanceFormGroup.patchValue(employee);
        
  }

  calculateBal()
  {
    // debugger;
    
    this.BalanceAdvance=  this.RefundAmount - this.NewRefundAmount;

  }

  onEdit(row){
// debugger;
    console.log(row);
    // debugger;
    this.BalanceAdvance=0;
    this.RefundAmount=0;
    this.NewRefundAmount=0;
     console.log(row);

    if(row.BalanceAmount==0)
    {
      this.icon_disable=true;
    }
    else{
      this.icon_disable=false;
    var m_data ={"AdvanceDetailID":row.AdvanceDetailID,"BalanceAmount":row.BalanceAmount,"AdvanceId":row.AdvanceId}
 
   
   console.log(m_data);
   this.advId = m_data.AdvanceId;
   this.advDetailId = m_data.AdvanceDetailID;
    }

    this.BalanceAmount=row.BalanceAmount;
  this.BalanceAdvance = parseInt(row.BalanceAmount) - parseInt(row.RefundAmount);
  this.RefundAmount=row.RefundAmount;
  

    if(this.UsedAmount!=0)
    {
      this.BalanceAdvance = parseInt(row.RefundAmount) - parseInt(row.UsedAmount);
    }
    
  }
  onSave() {
    
    this.isLoading = 'submit';

    let IPRefundofAdvanceObj = {};
    IPRefundofAdvanceObj['RefundDate'] = this.dateTimeObj.date;
    IPRefundofAdvanceObj['RefundTime'] = this.dateTimeObj.time;
    IPRefundofAdvanceObj['BillId'] = 1;
    IPRefundofAdvanceObj['AdvanceId'] = this.advId;
    IPRefundofAdvanceObj['OPD_IPD_Type'] = 1;
    IPRefundofAdvanceObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,//this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
    IPRefundofAdvanceObj['RefundAmount'] = this.NewRefundAmount;
    IPRefundofAdvanceObj['Remark'] = this.RefundOfAdvanceFormGroup.get("Remark").value;
    IPRefundofAdvanceObj['TransactionId'] = '0';
    IPRefundofAdvanceObj['AddedBy'] = 0;
    IPRefundofAdvanceObj['IsCancelled'] = false;
    IPRefundofAdvanceObj['IsCancelledBy'] = 0;
    IPRefundofAdvanceObj['IsCancelledDate'] = '01/01/1900';
    IPRefundofAdvanceObj['RefundId'] = '0';


    let UpdateAdvanceHeaderObj = {};
    UpdateAdvanceHeaderObj['AdvanceId'] =this.advId;
    UpdateAdvanceHeaderObj['advanceUsedAmount'] = this.BalanceAdvance;
    UpdateAdvanceHeaderObj['BalanceAmount'] = this.BalanceAdvance;

    let InsertIPRefundofAdvanceDetailObj = {};
    //InsertIPRefundofAdvanceDetailObj['AdvRefId'] = '0';
    InsertIPRefundofAdvanceDetailObj['AdvDetailId'] = this.advDetailId;
    InsertIPRefundofAdvanceDetailObj['RefundDate'] = this.dateTimeObj.date;
    InsertIPRefundofAdvanceDetailObj['RefundTime'] = this.dateTimeObj.time;
    InsertIPRefundofAdvanceDetailObj['AdvRefundAmt'] = this.NewRefundAmount;

    let UpdateAdvanceDetailBalAmountObj = {};
    UpdateAdvanceDetailBalAmountObj['AdvanceDetailID'] =  this.advDetailId;
    UpdateAdvanceDetailBalAmountObj['RefundAmount'] = this.NewRefundAmount;
    UpdateAdvanceDetailBalAmountObj['BalanceAmount'] = this.BalanceAdvance;

    const IPRefundofAdvanceInsert = new IPRefundofAdvance(IPRefundofAdvanceObj);
    const advanceHeaderUpdate = new AdvanceHeader(UpdateAdvanceHeaderObj);
    const IPRefundofAdvanceDetailInsert = new IPRefundofAdvanceDetail(InsertIPRefundofAdvanceDetailObj);
    const AdvanceDetailBalAmountUpdate = new AdvanceDetailBalAmount(UpdateAdvanceDetailBalAmountObj);

    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID,//this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
    PatientHeaderObj['NetPayAmount'] =  this.NewRefundAmount;


    const dialogRef = this._matDialog.open(IPAdvancePaymentComponent,
      {
        maxWidth: "75vw",
        maxHeight: "93vh", width: '100%', height: "100%",
        data: {
          patientName: this._IpSearchListService.myRefundAdvanceForm.get("PatientName").value,
          advanceObj: PatientHeaderObj,
          FromName: "Advance-Refund"
        }
      });
      // // debugger;
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
     
      console.log('============================== Return RefAdv ===========');
      let submitData = {
        "insertIPRefundofAdvance": IPRefundofAdvanceInsert,
        "updateAdvanceHeader": advanceHeaderUpdate,
        "insertIPRefundofAdvanceDetail": IPRefundofAdvanceDetailInsert,
        "updateAdvanceDetailBalAmount": AdvanceDetailBalAmountUpdate,
        "insertPayment": result.submitDataPay.ipPaymentInsert
      };
      // console.log("Submit Data:");
      console.log(submitData);
      this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Refund Of Advance data saved Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this.getRefundofAdvanceList();
            this.getReturndetails();
            let m=response;
          this.getPrint(m);
          this.dialogRef.close();
            }
          });
        } else {
          Swal.fire('Error !', 'Refund Of Advance data not saved', 'error');
        }
        this.isLoading = '';
      });
    
    });

  }

  convertToWord(e){
    
    //  return converter.toWords(e);
       }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=4';
    this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName','HospitalAddress','RefundId','PaymentDate','RegNo','IPDNo','GenderName','PatientName','RefundAmount','Remark','AddedBy'];
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        this.printTemplate = this.printTemplate.replace('StrRefundAmountInWords', this.convertToWord(this.reportPrintObj.RefundAmount));
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 500);
    });
  }

getPrint(el) {
 console.log(el);
  var D_data = {
    "RefundId": el,
  }

  let printContents; 
  this.subscriptionArr.push(
    this._IpSearchListService.getrefundAdvanceReceiptPrint(D_data).subscribe(res => {
      if(res){
      this.reportPrintObj = res[0] as BrowseIpdreturnadvanceReceipt;
      
     }
    
     
      this.getTemplate();
          
    })
  );
}


print() {
  
  let popupWin, printContents;
  

  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  
  popupWin.document.write(` <html>
  <head><style type="text/css">`);
  popupWin.document.write(`
    </style>
        <title></title>
    </head>
  `);
  popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
  </html>`);
  popupWin.document.close();
}
  onClose() {
    this._IpSearchListService.myRefundAdvanceForm.reset();
   
    this.dialogRef.close();
  }
}

export class IPRefundofAdvance {
  RefundDate: Date;
  RefundTime: any;
  BillId: number;
  AdvanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  UsedAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  Remark: string;
  TransactionId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  RefundId: number;


  constructor(IPRefundofAdvanceObj) {

    this.RefundDate = IPRefundofAdvanceObj.RefundDate || '0';
    this.RefundTime = IPRefundofAdvanceObj.RefundTime || '0';
    this.BillId = IPRefundofAdvanceObj.BillId || 0;
    this.AdvanceId = IPRefundofAdvanceObj.AdvanceId || '0';
    this.OPD_IPD_Type = IPRefundofAdvanceObj.OPD_IPD_Type || '0';
    this.OPD_IPD_ID = IPRefundofAdvanceObj.OPD_IPD_ID || '0';
    this.UsedAmount = IPRefundofAdvanceObj.UsedAmount || '0';
    this.BalanceAmount = IPRefundofAdvanceObj.BalanceAmount || '0';
    this.RefundAmount = IPRefundofAdvanceObj.RefundAmount || '0';
    this.Remark = IPRefundofAdvanceObj.Remark || '';
    this.TransactionId = IPRefundofAdvanceObj.TransactionId || 0;
    this.AddedBy = IPRefundofAdvanceObj.AddedBy || 0;
    this.IsCancelled = IPRefundofAdvanceObj.IsCancelled || false;
    this.IsCancelledBy = IPRefundofAdvanceObj.IsCancelledBy || 0;
    this.IsCancelledDate = IPRefundofAdvanceObj.IsCancelledDate || '';
    this.RefundId = IPRefundofAdvanceObj.RefundId || '0';
  }

}

export class AdvanceHeader {

  AdvanceId: number;
  BalanceAmount: number;

  constructor(UpdateAdvanceHeaderObj) {

    this.AdvanceId = UpdateAdvanceHeaderObj.AdvanceId || 0;
    this.BalanceAmount = UpdateAdvanceHeaderObj.BalanceAmount || 0;
  }

}

export class IPRefundofAdvanceDetail {

  AdvRefId: number;
  AdvDetailId: number;
  RefundDate: Date;
  RefundTime: any;
  AdvRefundAmt: number;

  constructor(InsertIPRefundofAdvanceDetailObj) {

    this.AdvRefId = InsertIPRefundofAdvanceDetailObj.AdvRefId || 0;
    this.AdvDetailId = InsertIPRefundofAdvanceDetailObj.AdvDetailId || 0;
    this.RefundDate = InsertIPRefundofAdvanceDetailObj.RefundDate || '';
    this.RefundTime = InsertIPRefundofAdvanceDetailObj.RefundTime || '';
    this.AdvRefundAmt = InsertIPRefundofAdvanceDetailObj.AdvRefundAmt || 0;

  }

}

export class AdvanceDetailBalAmount {

  AdvanceDetailID: number;
  RefundAmount: number;
  BalanceAmount: number;

  constructor(UpdateAdvanceDetailBalAmountObj) {

    this.AdvanceDetailID = UpdateAdvanceDetailBalAmountObj.AdvanceDetailID || 0;
    this.BalanceAmount = UpdateAdvanceDetailBalAmountObj.BalanceAmount || 0;
    this.RefundAmount = UpdateAdvanceDetailBalAmountObj.RefundAmount || 0;

  }

}
// Relatedquery
// select * from AdvRefundDetail order by 1 desc
// select * from AdvanceHeader order by 1 desc
// select * from AdvRefundDetail order by 1 desc



export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    RegNo: number;
    RegId: number;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:string;
    Remark: string;
    PaymentDate: any;
    CashPayAmount : number;
    ChequePayAmount : number;
    CardPayAmount : number;
    AdvanceUsedAmount: number;
    AdvanceId:number;
    RefundId: number;
    IsCancelled: boolean;
    AddBy: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    AddedBy:string;
    HospitalName:string;
    RefundAmount:number;
    RefundNo:number;
    HospitalAddress:string;
    Phone:any;
    EmailId:any;
     Age:number;
     AgeYear:number;
     IPDNo:any;
     NetPayableAmt:any;
    /**
     * Constructor
     *
     * @param BrowseIpdreturnadvanceReceipt
     */
    constructor(BrowseIpdreturnadvanceReceipt) {
        {
            this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
            this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
            this.RegNo = BrowseIpdreturnadvanceReceipt.RegNo || '';
            this.RegId = BrowseIpdreturnadvanceReceipt.RegId || '';
            this.PatientName = BrowseIpdreturnadvanceReceipt.PatientName || '';
            this.FirstName = BrowseIpdreturnadvanceReceipt.FirstName || '';
            this.MiddleName = BrowseIpdreturnadvanceReceipt.MiddleName || '';
            this.LastName = BrowseIpdreturnadvanceReceipt.LastName || '';
            this.TotalAmt = BrowseIpdreturnadvanceReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseIpdreturnadvanceReceipt.BalanceAmt || '';
            this.Remark = BrowseIpdreturnadvanceReceipt.Remark || '';
            this.PaymentDate = BrowseIpdreturnadvanceReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseIpdreturnadvanceReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseIpdreturnadvanceReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseIpdreturnadvanceReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseIpdreturnadvanceReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseIpdreturnadvanceReceipt.AdvanceId || '';
            this.RefundId = BrowseIpdreturnadvanceReceipt.RefundId || '';
            this.IsCancelled = BrowseIpdreturnadvanceReceipt.IsCancelled || '';
            this.AddBy = BrowseIpdreturnadvanceReceipt.AddBy || '';
            this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
            this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
            this.HospitalName=BrowseIpdreturnadvanceReceipt.HospitalName;
            this.RefundAmount = BrowseIpdreturnadvanceReceipt.  RefundAmount|| '';
            this. RefundNo = BrowseIpdreturnadvanceReceipt. RefundNo|| ''; 
            this. GenderName = BrowseIpdreturnadvanceReceipt. GenderName || ''; 
            this. AddedBy = BrowseIpdreturnadvanceReceipt. AddedBy|| '';
            this. HospitalAddress = BrowseIpdreturnadvanceReceipt. HospitalAddress || '';
           this.AgeYear=BrowseIpdreturnadvanceReceipt.AgeYear || ''
           this.IPDNo=BrowseIpdreturnadvanceReceipt.IPDNo || '';
           this.Phone=BrowseIpdreturnadvanceReceipt.Phone || ''
           this.EmailId=BrowseIpdreturnadvanceReceipt.EmailId || '';

           this.NetPayableAmt=BrowseIpdreturnadvanceReceipt.NetPayableAmt || 0;
        }

    }
}