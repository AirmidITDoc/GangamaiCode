import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Injectable({
  providedIn: 'root'
})
export class PrintserviceService {

  constructor( public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,) { }
     Onprint(field,Id,data) {
          setTimeout(() => {
              let param = {
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
                              title: data + " "+ "Viewer"
                          }
                      });
                  matDialog.afterClosed().subscribe(result => {
                  });
              });
          }, 100);
      }
}
