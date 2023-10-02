import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintPreviewService {

  constructor() { }


  PrintPreview(PrintTemplate: any) {
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${PrintTemplate}</body>
    </html>`);
    popupWin.document.close();
  }

}
