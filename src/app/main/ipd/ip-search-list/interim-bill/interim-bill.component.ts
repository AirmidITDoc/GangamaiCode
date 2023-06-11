import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
import { Subscription } from 'rxjs';
import { ChargesList } from '../ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-interim-bill',
  templateUrl: './interim-bill.component.html',
  styleUrls: ['./interim-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InterimBillComponent implements OnInit {

  screenFromString = 'IP-billing';
  totalCount: any;
  netAmount: number = 0;
  netbillamt :number =0;
  interimArray: any = [];
  isLoading: String = '';
  dateTimeObj: any;
  InterimFormGroup: FormGroup;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount: number;
  RefundBalAmount: number;
  BillDate: Date; 
  RefundAmount: number;
  Remark: string;
  totalAmtOfNetAmt: any;
  netPaybleAmt: any = 0;
  ConcessionId :any;
  BalanceAmt:any;
  selectedAdvanceObj: Bill;
  reportPrintObj: ReportPrintObj;
  reportPrintObjList: ReportPrintObj[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  currentDate = new Date();

  displayedColumns = [
  
    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'ChargeDoctorName',
    'ClassName',
    
  ];
  

     dataSource = new MatTableDataSource<ChargesList>();
    

  constructor(
    public _IpSearchListService:IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe, 
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<InterimBillComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.InterimFormGroup=this.InterimForm();
      if(data) {
      this.interimArray =data;
      console.log(this.interimArray);
      this.totalCount = data.length;
      data.filter(element => {
        this.netAmount = this.netAmount + parseInt(element.NetAmount);
      });
    }
  }

  ngOnInit(): void {
    this.dataSource.data = [];
    this.dataSource.data = this.interimArray;
    console.log( this.dataSource.data);

    if(this.advanceDataStored.storage) {
      debugger;
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.ConcessionId=this.selectedAdvanceObj.concessionReasonId
      console.log(this.selectedAdvanceObj);
    } 
  }

  InterimForm(): FormGroup {
    return this.formBuilder.group({
     
      NetpayAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: [Validators.pattern("^[0-9]*$")],
      ConcessionId :[''],
      Remark: [''],
     

      price: [Validators.required,
        Validators.pattern("^[0-9]*$")],
        qty: [Validators.required,
        Validators.pattern("^[0-9]*$")],
        TotalAmount: [Validators.pattern("^[0-9]*$")],
        doctorId: [''],
        DoctorID: [''],
        discPer: [Validators.pattern("^[0-9]*$")],
        paidAmt: [''],
        discAmt: [Validators.pattern("^[0-9]*$")],
        balanceAmt: [''],
        netAmount: [''],
        totalAmount: [Validators.required,
        Validators.pattern("^[0-9]*$")],
        discAmount: [''],
        // BillingClassId:[''],
        BillDate: [''],
        BillRemark: [''],
        SrvcName: [''],
        TotalAmt: [0],
        concessionAmt: [0],
        FinalAmount: [0],
        ClassId: [],
        Percentage:[Validators.pattern("^[0-9]*$")],
        AdminCharges:[0],
        Amount:[Validators.pattern("^[0-9]*$")],
        ConcessionAmt: [''],
        GenerateBill: ['0'],
    });
  }

  getNetAmtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, {NetAmount}) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt = netAmt;
    this.netbillamt=netAmt;
    return netAmt;
  }


  onSave() {
    debugger;

    this.isLoading = 'submit';
    
    let interimBillChargesobj ={};

    interimBillChargesobj['chargesID']= 0// this.ChargesId;

    let insertBillUpdateBillNo1obj = {};

    
    insertBillUpdateBillNo1obj['billNo'] =0;
    insertBillUpdateBillNo1obj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID; 
    insertBillUpdateBillNo1obj['totalAmt'] = this.netAmount;
    insertBillUpdateBillNo1obj['concessionAmt'] = 0,//this.advanceAmount;
    insertBillUpdateBillNo1obj['netPayableAmt'] = this.netAmount;
    insertBillUpdateBillNo1obj['paidAmt'] = 0,//this.advanceAmount;
    insertBillUpdateBillNo1obj['balanceAmt'] = 0;
    insertBillUpdateBillNo1obj['billDate'] = this.dateTimeObj.date;
    insertBillUpdateBillNo1obj['opD_IPD_Type'] = 1,
    insertBillUpdateBillNo1obj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
    insertBillUpdateBillNo1obj['totalAdvanceAmount'] = 0;
    insertBillUpdateBillNo1obj['billTime'] = this.dateTimeObj.date;
    insertBillUpdateBillNo1obj['concessionReasonId'] = this.selectedAdvanceObj.concessionReasonId || 0,
    insertBillUpdateBillNo1obj['isSettled']=0,
    insertBillUpdateBillNo1obj['isPrinted'] = 1,
    insertBillUpdateBillNo1obj['isFree'] = 0,//this.advanceAmount;
    insertBillUpdateBillNo1obj['companyId'] = this.selectedAdvanceObj.companyId || 0,
    insertBillUpdateBillNo1obj['tariffId'] = this.selectedAdvanceObj.tariffId ||0,
    insertBillUpdateBillNo1obj['unitId'] =this.selectedAdvanceObj.unitId || 0;
    insertBillUpdateBillNo1obj['interimOrFinal'] = 1,
    insertBillUpdateBillNo1obj['companyRefNo'] = 0;
    insertBillUpdateBillNo1obj['concessionAuthorizationName'] =0;
    insertBillUpdateBillNo1obj['taxPer'] = this.InterimFormGroup.get('Percentage').value || 0,
    insertBillUpdateBillNo1obj['taxAmount'] = this.InterimFormGroup.get('Amount').value || 0,
    insertBillUpdateBillNo1obj['DiscComments'] = this.InterimFormGroup.get('Remark').value || ''

    let billDetailsInsert = [];
    
    this.dataSource.data.forEach((element) => {
      let billDetailsInsert1Obj = {};

    billDetailsInsert1Obj['billNo'] =0;
    billDetailsInsert1Obj['chargesID'] = element.ChargesId;

    billDetailsInsert.push(billDetailsInsert1Obj);
    });  

    
    // let billIPInterimBillingUpdate = {};

    // billIPInterimBillingUpdate['billNo'] =0;

    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID || 0; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
    PatientHeaderObj['NetPayAmount'] = this.netAmount;
   
     const interimBillCharge = new interimBill(interimBillChargesobj);
     const insertBillUpdateBillNo1 = new Bill(insertBillUpdateBillNo1obj);
    //  const billDetailsInsert1 = new billDetails(billDetailsInsert1Obj);
    
    
    const dialogRef = this._matDialog.open(IPAdvancePaymentComponent,
      {
        maxWidth: "85vw",
        height: '540px',
        width: '100%',
        data: {
          patientName:"RK" ,//this._IpSearchListService.myShowAdvanceForm.get("PatientName").value,
          advanceObj: PatientHeaderObj,
          FromName: "OP-Bill"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
            "interimBillChargesUpdate": interimBillCharge,
            "insertBillUpdateBillNo1": insertBillUpdateBillNo1,
            "billDetailsInsert1" :billDetailsInsert,
            "ipIntremPaymentInsert": result.submitDataPay.ipPaymentInsert,
            // "billIPInterimBillingUpdate":billIPInterimBillingUpdate
          };
        console.log(submitData);
          this._IpSearchListService.InsertInterim(submitData).subscribe(response => {
            
            if (response) {
              Swal.fire('Congratulations !', 'Interim data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
               //   let m=response;
                debugger;
                  this.getIPIntreimBillPrint(response);
                  this._matDialog.closeAll();
                }
              });
            } else {
              Swal.fire('Error !', 'Interim data not saved', 'error');
            }
            this.isLoading = '';
          });
        
    });
 
  }


  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }


  
  ///// REPORT  TEMPOATE
  getTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=16';
    this._IpSearchListService.getTemplate(query).subscribe((resData: any) => {
     
        this.printTemplate = resData[0].TempDesign;
      // let keysArray = ['GroupName',"HospitalName","HospitalAddress","Phone","Pin",'BillNo','IPDNo','BillDate','PatientName','Age','GenderName','AdmissionDate','AdmissionTime','DischargeDate','DischargeTime','RefDocName','RoomName','BedName','PatientType','TotalAmt','NetPayableAmt','PaidAmount','PBillNo','UserName','AdvanceUsedAmount'];
      let keysArray = ['GroupName','RegNo','','IPDNo',  'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName','ChargesDoctorName', 'RoomName', 'BedName',
      'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'TotalAdvanceAmount', 'AdvanceBalAmount','UserName']; // resData[0].TempKeys;

        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        var strrowslist = "";
        for(let i=1; i<=this.reportPrintObjList.length; i++){
          var objreportPrint = this.reportPrintObjList[i-1];
// var strabc = ` <hr >

let docname;
if(objreportPrint.ChargesDoctorName)
docname=objreportPrint.ChargesDoctorName;
else
docname='';
var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:10px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:400px;margin-right:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;align-text:center;">
    <div>`+  docname + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:110px;align-text:center;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:50px;margin-left:40px;align-text:center;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;margin-left:50px;align-text:center;">
        <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }


        var objPrintWordInfo = this.reportPrintObjList[0];  
        console.log(objPrintWordInfo);
        var objPrintWordInfo = this.reportPrintObjList[0];
        this.BalanceAmt = parseInt(objPrintWordInfo.NetPayableAmt) - parseInt(objPrintWordInfo.AdvanceUsedAmount);
        console.log( this.BalanceAmt);

        this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));  
        this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform2(objPrintWordInfo.BillDate));  
        this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(objPrintWordInfo.BillDate));
        this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform2(objPrintWordInfo.AdmissionDate));
        this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transform1(objPrintWordInfo.DischargeDate));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrTotalAmt','₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrNetPayableAmt','₹' + (objPrintWordInfo.NetPayableAmt.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrConcessionAmount','₹' + (objPrintWordInfo.ConcessionAmt.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrAdvanceAmount', '₹' + (objPrintWordInfo.TotalAdvanceAmount.toFixed(2)));
        debugger;
        this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (this.BalanceAmt.toFixed(2)));
      
        this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));
    

        this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }

  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
 }

 
transform1(value: string) {
  var datePipe = new DatePipe("en-US");
   value = datePipe.transform(value, 'dd/MM/yyyy');
   return value;
}

transform2(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


convertToWord(e){
  // this.numberInWords= converter.toWords(this.mynumber);
  //  return converter.toWords(e);
     }

// GET DATA FROM DATABASE 
getIPIntreimBillPrint(el) {
   debugger;
  var D_data = {
    "BillNo":el,
  }
  // el.bgColor = 'red';
  //console.log(el);
  let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  this.subscriptionArr.push(
    this._IpSearchListService.getIPIntriemBILLBrowsePrint(D_data).subscribe(res => {
      console.log(res);
      this.reportPrintObjList = res as ReportPrintObj[];
      this.reportPrintObj = res[0] as ReportPrintObj;
    
    
    console.log(this.reportPrintObj);
      this.getTemplate();
      // console.log(res);
      
    })
  );
}

// PRINT 
print() {
  // HospitalName, HospitalAddress, AdvanceNo, PatientName
  let popupWin, printContents;
  // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

  popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
  // popupWin.document.open();
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
    this.dialogRef.close();
  }
}

export class interimBill{
  chargesId:number;

constructor(interimBill) {
  {
    this.chargesId = interimBill.chargesId || 0;
  }
}
}

export class Bill {
  AdmissionID:any;
  billNo: number;
  OPD_IPD_ID: any;
  totalAmt: any;
  concessionAmt: number;
  netPayableAmt: number;
  paidAmt: number;
  balanceAmt: number;
  billDate: Date;
  opD_IPD_Type: any;
  addedBy: number;
  totalAdvanceAmount: any;
  billTime: Date;
  concessionReasonId: any;
  isSettled:boolean;
  isPrinted: boolean;
  isFree: boolean;
  companyId: any;
  tariffId : any;
  unitId: any;
  interimOrFinal: boolean;
  companyRefNo: String;
  concessionAuthorizationName : String;
  taxPer: any;
  taxAmount: any;
  discComments : String;

  constructor(Bill) {
    {
      this.AdmissionID = Bill.AdmissionID || 0;
      this.billNo = Bill.billNo || 0;
      this.OPD_IPD_ID = Bill.OPD_IPD_ID || 0;
      this.totalAmt = Bill.totalAmt || 0;
      this.concessionAmt = Bill.concessionAmt || 0;
      this.netPayableAmt = Bill.netPayableAmt || 0;
      this.paidAmt = Bill.paidAmt || 0;
      this.balanceAmt = Bill.balanceAmt || 0;
      this.billDate = Bill.billDate || '01/01/1900';
      this.opD_IPD_Type = Bill.opD_IPD_Type || 1;
      this.addedBy = Bill.addedBy || 0;
      this.totalAdvanceAmount = Bill.totalAdvanceAmount || 0;
      this.billTime = Bill.billTime || '01/01/1900';
      this.concessionReasonId = Bill.concessionReasonId || 0;
      this.isSettled = Bill.isSettled || true;
      this.isPrinted = Bill.isPrinted || true;
      this.isFree = Bill.isFree || true;
      this.companyId = Bill.companyId || 0;
      this.tariffId = Bill.tariffId || 0;
       this.unitId = Bill.unitId || 0;
      this.interimOrFinal = Bill.interimOrFinal || 0;
      this.companyRefNo  = Bill.companyRefNo  ||  0;
      this.concessionAuthorizationName  = Bill.concessionAuthorizationName  || 0;
      this.taxPer = Bill.taxPer || 0;
      this.taxAmount  = Bill.taxAmount  ||  0;
      this.discComments  = Bill.discComments  || '';
    }
  }
}

export class billDetails{
  billNo:number;
  chargesID:number;

constructor(billDetails) {
  {
    this.billNo = billDetails.billNo || 0;
    this.chargesID = billDetails.chargesID || 0;
  }
}
}


export class AdmissionIPBilling{
  AdmissionID:number;
  
constructor(AdmissionIPBilling) {
  {
    this.AdmissionID = AdmissionIPBilling.AdmissionID || 0;
    
  }
}}

