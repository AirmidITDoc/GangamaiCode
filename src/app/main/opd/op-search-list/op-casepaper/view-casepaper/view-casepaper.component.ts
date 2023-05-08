import { Component, Inject, OnInit } from '@angular/core';
import { CasepaperVisitDetails } from '../op-casepaper.component';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { OPSearhlistService } from '../../op-searhlist.service';

@Component({
  selector: 'app-view-casepaper',
  templateUrl: './view-casepaper.component.html',
  styleUrls: ['./view-casepaper.component.scss']
})
export class ViewCasepaperComponent implements OnInit {

  selectedAdvanceObj: CasepaperVisitDetails;
  // selectedAdvanceObj: IpBillBrowseList;
  currentDate=new Date();
  subscriptionArr: Subscription[] = [];
  reportPrintObj: CasepaperVisitDetails;
     reportPrintObjList: CasepaperVisitDetails[] = [];
   dataSource = new MatTableDataSource<CasepaperVisitDetails>();
 
   Today:any

 outputWords='';
 
 
   // type Employee = Array<{ ServiceName: String; Qty: number;Price:number; }>;
 
 
   constructor(  private advanceDataStored: AdvanceDataStored,
     public datePipe: DatePipe,
     public _matDialog: MatDialog,
     public _OPSearhlistService: OPSearhlistService,
     // private ngxNumToWordsService: NgxNumToWordsService,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private accountService: AuthenticationService,) { 
      //  this.rptData = data;
     }
 
   ngOnInit(): void {
     this.Today = [(new Date()).toISOString()];
 
     if (this.advanceDataStored.storage) {
       this.selectedAdvanceObj = this.advanceDataStored.storage;
        /// console.log(this.selectedAdvanceObj);
     }
  
      this.getPrint();
           
   }
   
           
 
     getPrint() {
       debugger;
       var D_data = {
        "VisitId": 221420,//this.selectedAdvanceObj.AdmissionID || 0,
        "PatientType": 0,//this.selectedAdvanceObj.PatientType || 0
       
      }
          console.log(D_data);
          let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
         
            this._OPSearhlistService.getOPDPrecriptionPrint(D_data).subscribe(res => {
      
              this.reportPrintObjList = res as CasepaperVisitDetails[];
              console.log(this.reportPrintObjList);
              this.reportPrintObj = res[0] as CasepaperVisitDetails;
              console.log(this.reportPrintObj);

              var strrowslist = "";
              for (let i = 1; i <= this.reportPrintObjList.length; i++) {
                var objreportPrint = this.reportPrintObjList[i - 1];
                var strabc = `
            <div style="display:flex;margin:8px 0">
            <div style="display:flex;width:100px;margin-left:30px;">
                <div>`+ i + `</div> 
            </div>
            <div style="display:flex;width:100px;margin-left:10px;">
            <span >TAB</span>
            </div>
        
            <div style="display:flex;width:200px;margin-left:15px;">
            <div style="font-weight:700;">`+ objreportPrint.  DrugName + `</div> <!-- <div>BLOOD UREA</div> -->
            </div>
            <div style="display:flex;width:150px;margin-left:15px;">
                <div>`+ objreportPrint.DoseName + `</div> <!-- <div>BLOOD UREA</div> -->
            </div>
        
            <div style="display:flex;width:100px;margin-left:30px;">
                <div>`+ objreportPrint.TotalDayes + `</div> <!-- <div>450</div> -->
            </div>
          
            </div>`;
                strrowslist += strabc;
              }
           
            })
       
          // console.log(strabc);
        }
     
   

          
   onClose() {
     
     this._matDialog.closeAll();
   }
 
 }
 