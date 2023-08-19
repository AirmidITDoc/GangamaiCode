import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BrowseIPAdvanceService } from './browse-ipadvance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ViewIPAdvanceComponent } from './view-ipadvance/view-ipadvance.component';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import * as converter from 'number-to-words';
@Component({
  selector: 'app-browse-ipadvance',
  templateUrl: './browse-ipadvance.component.html',
  styleUrls: ['./browse-ipadvance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {


  hasSelectedContacts: boolean;
  outputWords=''
  BrowseOPDBillsList:any;
  msg:any;
  sIsLoading:any;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @Input() dataArray: any; 

  displayedColumns = [
    'RegNo',
    'Date',
    'PatientName',
    'AdvanceNo',
    'AdvanceAmount',
    // 'AddedBy',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'UserName',
    'buttons'
  ];
  dataSource = new MatTableDataSource<IpdAdvanceBrowseModel>();

  reportPrintObj: ReportPrintObj;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  // advanceDataStored: any;


  constructor(public _advanceService:BrowseIPAdvanceService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,) { }

  ngOnInit(): void {
   this.onShow_IpdAdvance();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    this.dataSource.data = changes.dataArray.currentValue as IpdAdvanceBrowseModel[];
    this.dataSource.sort =this.sort;
    this.dataSource.paginator=this.paginator;
  }

  getTemplate() {
    let query = 'select tempId,TempDesign,JSON_QUERY(TempKeys) as TempKeys from Tg_Htl_Tmp where TempId=1';
    this._advanceService.getTemplate(query).subscribe((resData: any) => {
      console.log(resData);
      this.printTemplate = resData[0].TempDesign;
     
       let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','AdvanceNo','RegNo','Date','PatientName','AgeDay','AgeMonth','Age','IPDNo','AdmissionDate','PatientType','AdvanceAmount','reason','Addedby',
       'CardNo','CardPayAmount','CardDate','CardBankName','BankName','ChequeNo','ChequePayAmount','ChequeDate','CashPayAmount','TariffName'];// resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
debugger;
        // var objPrintWordInfo = this.reportPrintObj[0];
        this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));

        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(new Date().toString()));
        this.printTemplate = this.printTemplate.replace('StrAddmissionDate', this.transform1(this.reportPrintObj.AdmissionDate));
        // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(this.reportPrintObj.Date));

        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}


  onShow_IpdAdvance(){
    var D_data= {
      "F_Name":this._advanceService.myFilterform.get("FirstName").value || "%",
      "L_Name":this._advanceService.myFilterform.get("LastName").value || "%",
      "From_Dt" : this.datePipe.transform(this._advanceService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : this.datePipe.transform(this._advanceService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
      "Reg_No":this._advanceService.myFilterform.get("RegNo").value || 0,
      "PBillNo":this._advanceService.myFilterform.get("PBillNo").value || 0,
    }
   
    console.log(D_data);
    this._advanceService.getIpdAdvanceBrowseList(D_data).subscribe(Visit=> {
        this.dataArray = Visit;
      });
  }

  onClear_IpdAdvance(){
    
  }

 
  convertToWord(e) {
    // this.numberInWords= converter.toWords(this.mynumber);
    return converter.toWords(e);
  }

  
 
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
 }

 transform1(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


  getPrint(el) {
    debugger;
    var D_data = {
      "AdvanceDetailID":60// el.AdvanceDetailID,
    }
    console.log(D_data);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._advanceService.getAdvanceBrowsePrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as ReportPrintObj;
        console.log(this.reportPrintObj);
        this.getTemplate();
     
        
      })
    );
  }

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

  getViewAdvance(contact)
{
  console.log(contact);
    let xx = {
      PaymentId:contact.PaymentId,
      HospitalName:contact.HospitalName,
      HospAddress:contact.HospitalAddress,
      Phone:contact.Phone,
      BillNo:contact.BillNo,
      RegNo:contact.RegNo,
      RegId: contact.RegId,
      PatientName: contact.PatientName,
      FirstName: contact.FirstName,
      MiddleName: contact.MiddleName, 
      LastName:contact.LastName,
      TotalAmt:contact.TotalAmt,
      BalanceAmt: contact.BalanceAmt,
      Remark: contact.Remark,
      PaymentDate: contact.PaymentDate,
      CashPayAmount : contact.CashPayAmount,
      ChequePayAmount :contact.ChequePayAmount,
      CardPayAmount :contact.CardPayAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      AdvanceId:contact.AdvanceId,
      RefundId: contact.RefundId,
      IsCancelled: contact.IsCancelled,
      AddBy: contact.AddBy,
      UserName:contact.UserName,
      PBillNo: contact.PBillNo,
      ReceiptNo: contact.ReceiptNo,
      TransactionType:contact.TransactionType,
      PayDate:contact.PayDate,
      PaidAmount: contact.PaidAmount,
      NEFTPayAmount:contact.NEFTPayAmount,
      PayTMAmount:contact.PayTMAmount,
      AdvanceDetailID:contact.AdvanceDetailID,
          
    };

    this.advanceDataStored.storage = new IpdAdvanceBrowseModel(xx);
   
      const dialogRef = this._matDialog.open(ViewIPAdvanceComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }



  onClear(){}

}

export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  HospitalName: any;
  RegNo: any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  TariffName:any;
  AdmissionDate:any;
}



export class IpdAdvanceBrowseModel {
  RegNo: Number;
  PatientName: string;
  Date: Date;
  AdvanceNo: string;
  TransactionID: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: number;
  TransactionType: number;
  UserName: string;
  RefundAmount:number;
  PrevAdvAmt:number;
  AdvanceId:number;
  IPDNo:any;
  AdvanceDetailID:number;
  HospitalName:any;
  HospAddress:any;
  Phone:any;
  EmailId:any;
  reason:any;
  /**
* Constructor
*
* @param IpdAdvanceBrowseModel
*/
  constructor(IpdAdvanceBrowseModel) {
      {
          this.RegNo = IpdAdvanceBrowseModel.RegNo || '';
          this.PatientName = IpdAdvanceBrowseModel.PatientName || '';
          this.Date = IpdAdvanceBrowseModel.Date || '';
          this.AdvanceNo = IpdAdvanceBrowseModel.AdvanceNo || '';
          this.AdvanceAmount = IpdAdvanceBrowseModel.AdvanceAmount || '';
          this.UsedAmount = IpdAdvanceBrowseModel.UsedAmount || '';
          this.BalanceAmount = IpdAdvanceBrowseModel.BalanceAmount || '';
          this.AddedBy = IpdAdvanceBrowseModel.AddedBy || '';
          this.CashPayAmount = IpdAdvanceBrowseModel.CashPayAmount || '';
          this.ChequePayAmount = IpdAdvanceBrowseModel.ChequePayAmount || '';
          this.CardPayAmount = IpdAdvanceBrowseModel.CardPayAmount || '';
          this.UserName = IpdAdvanceBrowseModel.UserName || '';
          this.RefundAmount = IpdAdvanceBrowseModel.RefundAmount || '';
          this.PrevAdvAmt=IpdAdvanceBrowseModel.PrevAdvAmt || '';
          this.AdvanceId = IpdAdvanceBrowseModel.AdvanceId || 0;
          this.AdvanceDetailID = IpdAdvanceBrowseModel.AdvanceDetailID || 0;
          this.IPDNo = IpdAdvanceBrowseModel.IPDNo || 0;

          this.HospitalName=IpdAdvanceBrowseModel.HospitalName || '';
          this.HospAddress = IpdAdvanceBrowseModel.HospAddress || '';
          this.Phone = IpdAdvanceBrowseModel.Phone || 0;
          this.EmailId = IpdAdvanceBrowseModel.EmailId || 0;
          this.reason = IpdAdvanceBrowseModel.reason || 0;
      }
  }
}
