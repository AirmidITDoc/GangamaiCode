import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Injectable({
    providedIn: 'root'
})
export class PrintserviceService {

    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,) { }

    /**
     * Show PDF preview in dialog
     * User can click Print button in viewer to print with thermal-optimized settings
     * @param field - The field name
     * @param Id - The field value
     * @param data - The report mode
     */
    Onprint(field, Id, data) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": field,
                        "fieldValue": String(Id),
                        "opType": "13"
                    }
                ],
                "mode": data
            }

            this._AppointmentlistService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: data + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
 OnprintOld(field, Id, data) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": field,
                        "fieldValue": String(Id),
                        "opType": "13"
                    }
                ],
                "mode": data
            }

            this._AppointmentlistService.getReportViewOld(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: data + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    /**
     * Thermal print with preview - shows preview, user clicks Print button for thermal-optimized printing
     * @param field - The field name (e.g., 'PaymentId', 'BillNo')
     * @param id - The field value
     * @param mode - The report mode (e.g., 'OPPaymentReceipt')
     */
    OnThermalPrint(field: string, id: any, mode: string) {
        this.Onprint(field, id, mode);
    }
    OnThermalPrintNew(field: string, id: any, mode: string) {
        //this.Onprint(field, id, mode);
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": field,
                        "fieldValue": String(id),
                        "opType": "13"
                    }
                ],
                "mode": mode
            }

            this._AppointmentlistService.getReportHtml(param).subscribe(res => {
                const matDialog = this._matDialog.open(HtmlviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            html: res["html"] as string,
                            title: res["title"]
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
}
