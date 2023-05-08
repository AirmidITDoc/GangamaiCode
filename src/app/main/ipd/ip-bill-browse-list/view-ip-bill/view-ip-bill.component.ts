import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IPBrowseBillService } from '../ip-browse-bill.service';
import { IpBillBrowseList } from '../ip-bill-browse-list.component';

@Component({
  selector: 'app-view-ip-bill',
  templateUrl: './view-ip-bill.component.html',
  styleUrls: ['./view-ip-bill.component.scss']
})
export class ViewIPBillComponent implements OnInit {

  selectedAdvanceObj: IpBillBrowseList;
  dataSource = new MatTableDataSource<IpBillBrowseList>();
rptData: any;
Today :any;
reportPrintObj: IpBillBrowseList;
reportPrintObjList: IpBillBrowseList[] = [];

mynumber:number=0;
outputWords=''
 
 subscriptionArr: Subscription[] = [];

  constructor(private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _IpBillBrowseListService:IPBrowseBillService,
    private accountService: AuthenticationService,) { 
     
    }

  ngOnInit(): void {
    this.Today = [(new Date()).toISOString()];

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      
    }
    console.log(this.selectedAdvanceObj);
    this.getPrint(this.selectedAdvanceObj.BillNo);
    this.convertToWord(this.selectedAdvanceObj.TotalAmt);

    if(this.data){
      this.reportPrintObj=this.data;
      console.log(this.reportPrintObj);
    }
  }


   
  convertToWord(e){
    // this.outputWords= converter.toWords(this.mynumber);
    // this.outputWords= converter.toWords(e);

    }

  getPrint(el) {
  debugger;
      var D_data = {
        "BillNo": el,
      }
     
      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          if(res){
          this.reportPrintObj = res[0] as IpBillBrowseList;
           console.log(this.reportPrintObj);
         }
       
        })
      );
    }
    

//  getPrint(el) {
//      debugger;
//         var D_data = {
//           "BillNo": el,
//         }
       
//         let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
//         this.subscriptionArr.push(
//           this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
//             if(res){
//             this.reportPrintObj = res[0] as IpBillBrowseList;
//             var strrowslist = "";
//             for(let i=1; i<=this.reportPrintObjList.length; i++){
//               var objreportPrint = this.reportPrintObjList[i-1];
//     var strabc = `<hr style="border-color:#a0a0a0">
//     <div style="display:flex;margin:8px 0">
//         <div style="display:flex;width:100px;margin-left:30px;">
//             <div>`+i+`</div> <!-- <div>BLOOD UREA</div> -->
//         </div>
//         <div style="display:flex;width:300px;margin-left:60px;">
//             <div>`+objreportPrint.ServiceName+`</div> <!-- <div>BLOOD UREA</div> -->
//         </div>
//         <div style="display:flex;width:150px;margin-left:70px;">
//             <div>`+objreportPrint.Price+`</div> <!-- <div>450</div> -->
//         </div>
//         <div style="display:flex;width:150px;margin-left:50px;">
//             <div>`+objreportPrint.Qty+`</div> <!-- <div>1</div> -->
//         </div>
//         <div style="display:flex;width:150px;margin-left:50px;">
//             <div>`+objreportPrint.NetAmount+`</div> <!-- <div>450</div> -->
//         </div>
//     </div>`;
//     strrowslist += strabc;
//             }
//            }
         
//           })
//         );
//       }

    
  // getPrint(el) {
  //   // debugger;
  //       var D_data = {
  //         "BillNo": el,
  //       }
       
  //       let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  //       this.subscriptionArr.push(
  //         this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
  //           if(res){
  //           this.reportPrintObj = res[0] as IpBillBrowseList;
  //           var strrowslist = "";
  //           for(let i=1; i<=this.reportPrintObjList.length; i++){
  //             var objreportPrint = this.reportPrintObjList[i-1];
  //   var strabc = `<hr style="border-color:#a0a0a0">
  //   <div style="display:flex;margin:8px 0">
  //       <div style="display:flex;width:100px;margin-left:30px;">
  //           <div>`+i+`</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:300px;margin-left:60px;">
  //           <div>`+objreportPrint.ServiceName+`</div> <!-- <div>BLOOD UREA</div> -->
  //       </div>
  //       <div style="display:flex;width:150px;margin-left:70px;">
  //           <div>`+objreportPrint.Price+`</div> <!-- <div>450</div> -->
  //       </div>
  //       <div style="display:flex;width:150px;margin-left:50px;">
  //           <div>`+objreportPrint.Qty+`</div> <!-- <div>1</div> -->
  //       </div>
  //       <div style="display:flex;width:150px;margin-left:50px;">
  //           <div>`+objreportPrint.NetAmount+`</div> <!-- <div>450</div> -->
  //       </div>
  //   </div>`;
  //   strrowslist += strabc;
  //           }
  //          }
         
  //         })
  //       );
  //     }

      
  onClose() {
   
    this._matDialog.closeAll();
  }
  

}
