import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { BrowseRefundlistService } from './browse-refundlist.service';
import { BrowseOPDBill, ViewBrowseOPDRefundComponent } from './view-browse-opdrefund/view-browse-opdrefund.component';
import { fuseAnimations } from '@fuse/animations';
import * as converter from 'number-to-words';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-browse-refund-list',
  templateUrl: './browse-refund-list.component.html',
  styleUrls: ['./browse-refund-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class BrowseRefundListComponent implements OnInit {

  
  msg: any;
  sIsLoading: string = '';
  reportPrintObj: BrowseIpdreturnadvanceReceipt;
  currentDate=new Date();
  subscriptionArr: Subscription[] = [];
  printTemplate: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  click: boolean = false;
  MouseEvent = true;
  displayedColumns = [
    'RefundDate',
    'RefundNo',
    'RegId',
    'PatientName',
    'PaymentDate',
    'RefundAmount',
    'TotalAmt',
    'MobileNo',
    "BillId",
    // 'CashPayAmount',
    // 'ChequePayAmount',
    // 'CardPayAmount',
    'buttons'

    // 'action'
  ];
  dataSource = new MatTableDataSource<RefundMaster>();

  hasSelectedContacts: boolean;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDReturnsService: BrowseRefundlistService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getBrowseOPDReturnList();
   
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 

  onShow(event: MouseEvent) {
      this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseOPDReturnList();
      }
    }, 200);
    this.MouseEvent = true;
  }



  onClear() {

    this._BrowseOPDReturnsService.myFilterform.get('FirstName').reset();
    this._BrowseOPDReturnsService.myFilterform.get('LastName').reset();
    this._BrowseOPDReturnsService.myFilterform.get('RegNo').reset();

  }
  
  getBrowseOPDReturnList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOPDReturnsService.myFilterform.get("FirstName").value + '%' || '%',
      "L_Name": this._BrowseOPDReturnsService.myFilterform.get("LastName").value + '%' || '%',
      "From_Dt": this.datePipe.transform(this._BrowseOPDReturnsService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._BrowseOPDReturnsService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._BrowseOPDReturnsService.myFilterform.get("RegNo").value || 0

    }
    console.log(D_data)
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
      this._BrowseOPDReturnsService.getBrowseOPDReturnReceiptList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as RefundMaster[];
        console.log(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
        this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);

  }



  getViewbill(contact)
  {
    
      let xx = {

        RefundNo:contact.RefundNo,
        PaymentDate: contact.PaymentDate,
        PaymentId :contact.PaymentId,
        RegNo: contact.RegNo,
        RegId:contact.RegId,
        GenderName:contact.GenderName,
        PatientName: contact.PatientName,
        BillNo: contact.BillNo,
        BillId:contact.BillId,
        BillDate:contact.BillDate,
        RefundAmount:contact.RefundAmount,
        BillAmount:contact.BillAmount,
        RefundId: contact.RefundId,
        Remark: contact.Remark,
        AddedBy:contact.AddedBy,
        PBillNo:contact.PBillNo,
      
      };
  
      this.advanceDataStored.storage = new BrowseOPDBill(xx);
     
        const dialogRef = this.matDialog.open(ViewBrowseOPDRefundComponent, 
         {  maxWidth: "95vw",
            maxHeight: "130vh", width: '100%', height: "100%"
       });
       dialogRef.afterClosed().subscribe(result => {
        
       });
    }
  


  getRecord(el, i) {
    // console.log(el,i);
    // this.matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }
  ngOnChanges(changes: SimpleChanges) {
   
    this.dataSource.data = changes.dataArray.currentValue as RefundMaster[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

 

  
// SpinLoading:boolean=false;
viewgetOPRefundofBillPdf(row) {
  // this.sIsLoading = 'loading-data';
  debugger
  setTimeout(() => {
  this._BrowseOPDReturnsService.getOpRefundview(
    row.RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Op Refund Of Bill Receipt Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        // this.SpinLoading = false;
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
      });
  });
 
  },100);
}

}


export class RefundMaster {
  RefundId: number;
  RegId: number;
  RefundDate: Date;
  RefundAmount: number;
  PBillNo: number;
  PatientName: Date;
  Total: number;
  PaymentId: number;
  PaymentDate: any;
  CashPayAmount:number;
  ChequePayAmount:number;
  CardPayAmount:number;
  TransactionType:number;
  PhoneNo:number;
  Remark:string;
  GenderName:string;
  AddedBy:string;
  AgeYear:number;
  BillDate:any;
  OPDNO:any;

  AdvanceNo: any;
  HospAddress: any;
  HospitalName: any;
  Phone:any;
  VisitDate:any;
  OPDNo:any;
EmailId:any;
  RegNo: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  
  constructor(RefundMaster) {
    {
      this.RefundId = RefundMaster.RefundId || 0;
      this.RegId = RefundMaster.RegId || '';
      this.BillDate = RefundMaster.BillDate || '';
      this.RefundDate = RefundMaster.RefundDate || '';
      this.RefundAmount = RefundMaster.RefundAmount || 0;
      this.PatientName = RefundMaster.PatientName || '';
      this.Total = RefundMaster.Total || 0 ;
      this.PBillNo = RefundMaster.PBillNo || '';
      this.PaymentId = RefundMaster.PaymentId || 0;
      this.PaymentDate = RefundMaster.PaymentDate || 0;
      this.CashPayAmount = RefundMaster.CashPayAmount || 0 ;
      this.ChequePayAmount = RefundMaster.ChequePayAmount || 0;
      this.CardPayAmount = RefundMaster.CardPayAmount || 0;
      this.TransactionType = RefundMaster.TransactionType || 0;
      this.PhoneNo = RefundMaster.PhoneNo || 0;
      this.Remark = RefundMaster.Remark || '';
      this.GenderName = RefundMaster.GenderName || '';
      this.AddedBy = RefundMaster.AddedBy || '';
      this.AgeYear=RefundMaster.AgeYear || 0; 
      this.OPDNO=RefundMaster.OPDNO || '';

      this.AdvanceNo = RefundMaster.AdvanceNo || 0;
      this.HospAddress = RefundMaster.HospAddress || 0;
      this.HospitalName = RefundMaster.HospitalName || '';
      this.RegNo = RefundMaster.RegNo || '';
      this.IPDNo = RefundMaster.IPDNo || '';
      this.PatientType=RefundMaster.PatientType || 0; 
      this.AdvanceAmount=RefundMaster.AdvanceAmount || '';
      this.Phone=RefundMaster.Phone || '';
      this.VisitDate =RefundMaster.VisitDate ||'';
      this.OPDNo=RefundMaster.OPDNo ||'';
      this.EmailId=RefundMaster.EmailId||'';
    }
  }
}



export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    BillDate:any;
    RegNo: number;
    RegId: number;
    RefundTime:any;
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
    MobileNo:any;
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
            this.BillDate=BrowseIpdreturnadvanceReceipt.BillDate || '';
            this.RefundTime=BrowseIpdreturnadvanceReceipt.RefundTime || '';
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
           this.MobileNo=BrowseIpdreturnadvanceReceipt.MobileNo || ''
           this.EmailId=BrowseIpdreturnadvanceReceipt.EmailId || '';

           this.NetPayableAmt=BrowseIpdreturnadvanceReceipt.NetPayableAmt || 0;
        }

    }
}