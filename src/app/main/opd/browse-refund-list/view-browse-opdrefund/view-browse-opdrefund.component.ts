import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { BrowseRefundlistService } from '../browse-refundlist.service';
import { RefundMaster } from '../browse-refund-list.component';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { BrowseIpdreturnadvanceReceipt } from 'app/main/ipd/ip-search-list/ip-refundof-advance/ip-refundof-advance.component';
import * as converter from 'number-to-words';

@Component({
  selector: 'app-view-browse-opdrefund',
  templateUrl: './view-browse-opdrefund.component.html',
  styleUrls: ['./view-browse-opdrefund.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class ViewBrowseOPDRefundComponent implements OnInit {

  selectedAdvanceObj: BrowseOPDBill;
  dataSource = new MatTableDataSource<RefundMaster>();

rptData: any;
reportPrintObj: RefundMaster;
SummaryData:any=[];  
  
subscriptionArr: Subscription[] = [];
printTemplate: any;
Today= this.datePipe.transform(new Date(), 'dd/MM/yyyy h:mm a'); 

mynumber:number=0;
RefundAmount=0;
outputWords=''

  constructor(
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _BrowseOpdRefundService:BrowseRefundlistService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    
    
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
     console.log(this.selectedAdvanceObj);
    }
     this.getPrint(this.selectedAdvanceObj.RefundId);
      this.convertToWord(this.selectedAdvanceObj.RefundAmount);
  }



  convertToWord(e){
    // this.outputWords= converter.toWords(this.mynumber);
    this.outputWords= converter.toWords(e);

    }

  getPrint(el) {
    debugger;
     var D_data = {
       "RefundId": el,
     }
     console.log(el);
     let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
     this.subscriptionArr.push(
       this._BrowseOpdRefundService.getRefundBrowsePrint(D_data).subscribe(res => {
         if(res){
         this.reportPrintObj = res[0] as RefundMaster;
        //  debugger;
         console.log(this.reportPrintObj);
         this.convertToWord(this.reportPrintObj.RefundAmount);
        }
                
       })
     );
   }

   
  onClose() {
   
    this._matDialog.closeAll();
  }
  


}


export class BrowseOPDBill
{
    BillNo: Number;
    RegId: number;
    PatientName: string;
    FirstName: string;
    Middlename: string; 
    LastName: string;
    TotalAmt: number;
    ConcessionAmt : number;
    NetPayableAmt: number;
     BillDate:any;
     PaymentDate:any;
    OPD_IPD_ID: number;
    IsCancelled: boolean;
    OPD_IPD_Type: number;
    PBillNo: string;
    BDate: Date;
    PaidAmount: number;
    RefundNo:number;
    VisitDate:any;
    PaymentId :number;
    RegNo:number;
    GenderName:string;
    AgeYear:number;
    RefundAmount:number;
    BillAmount:number;
    RefundId:number;
    Remark: string;
    AddedBy:string;
    OPDNo:any;
    ConsultantDoctorName:any;
    
    /**
     * Constructor
     *
     * @param BrowseOPDBill
     */
    constructor(BrowseOPDBill) {
        {
            this.BillNo = BrowseOPDBill.BillNo || '';
            this.RegId = BrowseOPDBill.RegId || '';
            this.PatientName = BrowseOPDBill.PatientName || '';
            this.FirstName = BrowseOPDBill.FirstName || '';
            this.Middlename = BrowseOPDBill.MiddleName || '';
            this.LastName = BrowseOPDBill.LastName || '';
            this.TotalAmt = BrowseOPDBill.TotalAmt || '';
            this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
            this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
            this.BillDate = BrowseOPDBill.BillDate || '';
            this.OPD_IPD_ID = BrowseOPDBill.OPD_IPD_ID || '';
            this.IsCancelled = BrowseOPDBill.IsCancelled || '';
            this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
            this.PBillNo = BrowseOPDBill.PBillNo || '';
            this.BDate = BrowseOPDBill.BDate || '';
            this.PaidAmount = BrowseOPDBill.PaidAmount || '';
            this.RefundNo= BrowseOPDBill.RefundNo || '';
            this.PaymentDate= BrowseOPDBill.PaymentDate || '';
            this. PaymentId = BrowseOPDBill.PaymentId || '';
            this.RegNo= BrowseOPDBill.RegNo || '';
            this.GenderName= BrowseOPDBill.GenderName || '';
            this.AgeYear=BrowseOPDBill.AgeYear || 0;
            this.RefundAmount= BrowseOPDBill.RefundAmount || '';
            this.BillAmount= BrowseOPDBill.BillAmount || '';
            this. RefundId= BrowseOPDBill.RefundId || '';
            this.Remark= BrowseOPDBill.Remark || '';
            this.AddedBy= BrowseOPDBill.AddedBy || '';
            this.OPDNo= BrowseOPDBill.OPDNo || 0;
            this.ConsultantDoctorName = BrowseOPDBill.ConsultantDoctorName || '';
            this.VisitDate =BrowseOPDBill.VisitDate || '';
        }
    }
}


