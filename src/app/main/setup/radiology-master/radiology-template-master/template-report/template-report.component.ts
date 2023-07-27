import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PrintServiceService } from 'app/core/services/print-service.service';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';

@Component({
  selector: 'app-template-report',
  templateUrl: './template-report.component.html',
  styleUrls: ['./template-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TemplateReportComponent implements OnInit {
 msg: any;
 reportdata: any=[];

  constructor(public _radiologytemplateService: RadiologyTemplateMasterService,
    public _printService: PrintServiceService
    ) { }

  ngOnInit(): void {
    this.getPrintQuery();
  }

  getPrintQuery() {
    var D_data = {
      "TemplateId": this._radiologytemplateService.myform.get("TemplateId").value,
    }
    this._radiologytemplateService.Print(D_data).subscribe(report => {
      this.reportdata = report; 
      console.log(this.reportdata);
    });
  }
  
  // Print(){
  //   // var D_data = {
  //   //   "TemplateId": this._radiologytemplateService.myform.get("TemplateId").value,
  //   // }
  //   this._printService.printDocument('invoice',this.reportdata.TemplateId);
  // }

print(cmpName) {
    let printContents = document.getElementById(cmpName).innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    // document.body.innerHTML = originalContents;
    window.close();
}

// onPrint(cmpName): void {
//   let printContents, popupWin;
//   printContents = document.getElementById(cmpName).innerHTML;
//   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//   popupWin.document.open();
//   popupWin.document.write(`
//     <html>
//       <head>
//         <title>Print tab</title>
//         <style>
//         //........Customized style.......
//         </style>
//       </head>
//   <body onload="window.print();window.close()">${printContents}</body>
//     </html>`
//   );
//   popupWin.document.close();
// }

// printToCart(printSectionId: string){
//   let popupWinindow
//   let innerContents = document.getElementById(printSectionId).innerHTML;
//   popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
//   popupWinindow.document.open();
//   popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
//   popupWinindow.document.close();
// }

  onprint(): void {
    let printContents, popupWin;
    printContents = document.getElementById('invoice').innerHTML;
    popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
    
    
          </style>
        </head>
    <body onload="window.print();window.close()">
        <div [innerHTML]="printContents"></div>
    </body>
      </html>`
    );
    popupWin.document.close()
  }
}

