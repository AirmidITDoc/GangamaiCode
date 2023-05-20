import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TemplatemasterService } from "../templatemaster.service";
import { PrintServiceService } from "app/core/services/print-service.service";

@Component({
    selector: "app-template-report",
    templateUrl: "./template-report.component.html",
    styleUrls: ["./template-report.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplateReportComponent implements OnInit {
    msg: any;
    reportdata: any = [];
    constructor(
        public _templateService: TemplatemasterService //public _printService: PrintServiceService
    ) {}
    ngOnInit(): void {
        //  this.getPrintQuery();
    }
    getPrintQuery() {
        // var D_data = {
        //     PTemplateId: this._templateService.myform.get("PTemplateId").value,
        // };
        // this._templateService.Print(D_data).subscribe((report) => {
        //     this.reportdata = report;
        //     console.log(this.reportdata);
        // });
    }
    print(cmpName) {
        // let printContents = document.getElementById(cmpName).innerHTML;
        // let originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        // window.print();
        // // document.body.innerHTML = originalContents;
        // window.close();
    }
    onprint(): void {
        //     let printContents, popupWin;
        //     printContents = document.getElementById("invoice").innerHTML;
        //     popupWin = window.open("", "_blank");
        //     popupWin.document.open();
        //     popupWin.document.write(`
        //    <html>
        //      <head>
        //        <title></title>
        //        <style>
        //        </style>
        //      </head>
        //  <body onload="window.print();window.close()">
        //      <div [innerHTML]="printContents"></div>
        //  </body>
        //    </html>`);
        //     popupWin.document.close();
    }
}
