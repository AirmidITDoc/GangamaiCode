import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { QzTrayService } from './QzTrayService.service';

@Injectable({
    providedIn: 'root'
})
export class PrintserviceService  {

    readonly qzService = inject(QzTrayService);
    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        public toastr: ToastrService,
       // private qzService: QzTrayService 
    ) {  }

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
                if(res){
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
            }else{
                 this.toastr.warning('Network issue try again', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
            }
            });
        }, 100);
    }
 
// Update code //

OnprintDirect(field: string, Id: number | string, data: string, IsPrintWithoutPreview: boolean = false) {
  debugger;
  const param = {
    searchFields: [{ fieldName: field, fieldValue: String(Id), opType: "13" }],
    mode: data
  };

  this._AppointmentlistService.getReportView(param).subscribe(async res => {
    if (res) {
      let pdfBase64 = res["base64"] as string;

      if (IsPrintWithoutPreview) { 
        if (pdfBase64.includes(',')) { pdfBase64 = pdfBase64.split(',')[1];         } 
        const dataToPrint = [
          {
            type: 'pixel',
            format: 'pdf',
            flavor: 'base64', 
            data: pdfBase64   
          }
        ]; 
    
        try {
          const success = await this.qzService.printCommand(dataToPrint, 1); 
        
          if (success) {      
            console.log("Printed successfully to default printer!");  
          } else {
            this.toastr.error(
              'Silent print failed, check QZ Tray connection or logs.',
              'Error!'
            );
          }
          
        } catch (error) {
          console.error('QZ Tray print error:', error);
          this.toastr.error(
            'Silent print failed, check QZ Tray connection.',
            'Error!'
          );
        }

      } else {
        this._matDialog.open(PdfviewerComponent, {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: pdfBase64,
            title: `${data} Viewer`
          }
        });
      }
    } else {
      this.toastr.warning('Network issue, try again', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
  });
}








//     OnprintDirect(field: string, Id: number | string, data: string, IsPrintWithoutPreview: boolean = false) {
//   const param = {
//     searchFields: [{ fieldName: field, fieldValue: String(Id), opType: "13" }],
//     mode: data
//   };

//   this._AppointmentlistService.getReportView(param).subscribe(res => {
//     if (res) {
//       const pdfBase64 = res["base64"] as string;
//       const byteArray = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
//       const blob = new Blob([byteArray], { type: 'application/pdf' });
//       const blobUrl = URL.createObjectURL(blob);

//       if (IsPrintWithoutPreview) {
//         const iframe = document.createElement('iframe');
//         iframe.style.position = 'fixed';
//         iframe.style.width = '0';
//         iframe.style.height = '0';
//         iframe.style.border = 'none';
//         iframe.style.left = '-9999px';
//         iframe.style.top = '-9999px';
//         iframe.src = blobUrl;
//         document.body.appendChild(iframe);

//         iframe.onload = () => {
//           try {
//             iframe.contentWindow?.focus();
//             iframe.contentWindow?.print(); 
//           } catch (e) {
//             console.error('Print error:', e);
//             window.open(blobUrl, '_blank');
//           } finally {
//             setTimeout(() => {
//               document.body.removeChild(iframe);
//               URL.revokeObjectURL(blobUrl);
//             }, 1000);
//           }
//         };
//       } else {
//         // Show preview in dialog
//         this._matDialog.open(PdfviewerComponent, {
//           maxWidth: "85vw",
//           height: '750px',
//           width: '100%',
//           data: {
//             base64: pdfBase64,
//             title: `${data} Viewer`
//           }
//         });
//       }
//     } else {
//       this.toastr.warning('Network issue, try again', 'Warning !', {
//         toastClass: 'tostr-tost custom-toast-warning',
//       });
//     }
//   });
// }

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
