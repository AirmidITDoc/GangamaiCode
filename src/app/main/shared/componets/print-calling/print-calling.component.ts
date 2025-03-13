import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
    selector: 'app-print-calling',
    templateUrl: './print-calling.component.html',
    styleUrls: ['./print-calling.component.scss']
})
export class PrintCallingComponent implements OnInit {

    constructor(
        public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
    ) { }
    ngOnInit() {
    }



    Onprint() {
        setTimeout(() => {
            let param = {
                
                    "searchFields": [
                        {
                            "fieldName": "BillNo",
                            "fieldValue": "216339",
                            "opType": "13"
                        }
                    ],
                    "mode": "OpBillReceipt"
                }

            console.log(param)
            
            this._AppointmentlistService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Op Bill  Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
}
