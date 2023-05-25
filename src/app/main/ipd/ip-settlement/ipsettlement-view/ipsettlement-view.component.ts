import { Component, OnInit } from '@angular/core';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
import { Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { IPSearchListService } from '../../ip-search-list/ip-search-list.service';

@Component({
  selector: 'app-ipsettlement-view',
  templateUrl: './ipsettlement-view.component.html',
  styleUrls: ['./ipsettlement-view.component.scss']
})
export class IPSettlementViewComponent implements OnInit {

 
  selectedAdvanceObj: ReportPrintObj;

rptData: any;
Today :any;
reportPrintObj: ReportPrintObj;

// reportPrintObjList: IpBillBrowseList[] = [];

mynumber:number=0;
outputWords=''
 
 subscriptionArr: Subscription[] = [];

  constructor(private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public _opSearchListService:IPSearchListService,
    private accountService: AuthenticationService,) { 
     
    }

  ngOnInit(): void {
    this.Today = [(new Date()).toISOString()];

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      
    }
    debugger;

    this.getPrint(this.selectedAdvanceObj.BillNo);
    // this.convertToWord(this.reportPrintObj.PaidAmount);
  }


   
  convertToWord(e){
  
    // this.outputWords= converter.toWords(this.mynumber);
    // this.outputWords= converter.toWords(e);
    console.log(this.outputWords);
    }

  getPrint(el) {
  debugger;
      var D_data = {
        "PaymentId":el
      }
     
      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._opSearchListService.getPaymentPrint(D_data).subscribe(res => {
          if(res){
          this.reportPrintObj = res[0] as ReportPrintObj;
          this.convertToWord(this.reportPrintObj.PaidAmount);
           console.log(this.reportPrintObj);
         }
       
        })
      );
    }
    

      
  onClose() {
   
    this._matDialog.closeAll();
  }
  

}

