import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';

@Injectable({
  providedIn: 'root'
})
export class PrintPreviewService {

  printTemplate: any;

  constructor( private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef) { }


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

  PrintView(PrintTemplate: any) {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${PrintTemplate}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    // popupWin.document.close();
  }




print(PrintTemplate: any) {
  
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
  popupWin.document.write(`<body onload="window.print();window.close()"></body> 
  </html>`);

  // if(this.reportPrintObj.CashPayAmount === 0) {
  //   popupWin.document.getElementById('idCashpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.CardPayAmount === 0) {
  //   popupWin.document.getElementById('idCardpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.ChequePayAmount === 0) {
  //   popupWin.document.getElementById('idChequepay').style.display = 'none';
  // }
  // if(this.reportPrintObj.NEFTPayAmount === 0) {
  //   popupWin.document.getElementById('idNeftpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.PayTMAmount === 0) {
  //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.PayTMAmount === 0) {
  //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  // }
  // if(this.reportPrintObj.Remark === '') {
  //   popupWin.document.getElementById('idremark').style.display = 'none';
  // }
  this.createCDKPortal({}, popupWin);
  popupWin.document.close();
}

  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      const injector = this.createInjector(data);
      let componentInstance;
      componentInstance = this.attachHeaderContainer(outlet, injector);
      // console.log(windowInstance.document)
      let template = windowInstance.document.createElement('div'); // is a node
      template.innerHTML = this.printTemplate;
      windowInstance.document.body.appendChild(template);
    }
  }
  createInjector(data): any {
    const injectionTokens = new WeakMap();
    injectionTokens.set({}, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  attachHeaderContainer(outlet, injector) {
    const containerPortal = new ComponentPortal(HeaderComponent, null, injector);
    const containerRef: ComponentRef<HeaderComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }




}