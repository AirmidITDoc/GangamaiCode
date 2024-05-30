import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemNameList } from '../purchase-order/purchase-order.component';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UpdateWorkorderComponent } from './update-workorder/update-workorder.component';
import { SearchInforObj } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { element } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Printsal } from 'app/main/pharmacy/sales/sales.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class WorkOrderComponent implements OnInit {
  
  @ViewChild('WorkorderTemplate') WorkorderTemplate:ElementRef;


  displayedColumns: string[] = [
    'WOId',
    'Date',
    'SupplierName',
    'WOTotalAmount',
    'WOVatAmount',
    'WODiscAmount',
    'WoNetAmount',
    'Remark',
    'action'
  ];
  displayedColumnsnew: string[] = [
    'ItemName',
    'Qty',
    'Rate',
    'TotalAmount',
    'Disc',
    'DiscAmt',
    'GST',
    'GSTAmt',
    'NetAmount',
    'Specification',
    'Action'
  ];

    
  reportPrintObjList: WorkOrderList[] = [];
  printTemplate: any;
  reportPrintObj: WorkOrderList;
  reportPrintObjTax: WorkOrderList;
  subscriptionArr: Subscription[] = [];


 
  sIsLoading: string = '';
  isLoading = true;
  StoreList: any = [];
  SupplierList: any = [];
  filteredOptions: any;
  screenFromString = 'admission-form';
  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemName: any;
  filteredOptionsItem: any;
  ItemId: any;
  isItemIdSelected: boolean = false;
  isLoadings: String = '';
  Qty: any;
  NetAmount: any;
  Rate: any;
  TotalAmount: any;
  Disc: any;
  DiscAmt: any;
  DisAmount: any;
  GSTAmt: any;
  GSTAmount:any;
  GST: any;
  WorkOrderlist:any=[];
  Specification: any;
  NewDate= new Date();
  CurrentDate:any;
  FromDate:any='FromDate'
  ToDate:any='ToDate'
  dsWorkOrderList = new MatTableDataSource<WorkOrderList>();
  NewWorkOrderList = new MatTableDataSource<NewWorkOrderList>();



  @ViewChild(MatSort ,{static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _WorkOrderService: WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public toastr : ToastrService,

  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getWorkOrdersList();
    this.CurrentDate=this.datePipe.transform(this.NewDate ,"MM-dd-yyyy");
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
   // console.log(vdata);
    this._WorkOrderService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._WorkOrderService.myFormGroup.get('StoreId').setValue(this.StoreList[0]);
      //this._WorkOrderService.NewWorkForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }

  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  isSupplierIdSelected:boolean=false;
  getSuppliernameList() {
    var m_data = {
      'SupplierName': `${this._WorkOrderService.myFormGroup.get('SupplierName').value}%`
    }
    this._WorkOrderService.getSupplierList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
    })
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getWorkOrdersList() {
    //debugger
     this.sIsLoading = 'loading-data';
    var m_data = {
      "ToStoreId": this._WorkOrderService.myFormGroup.get("StoreId").value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("startdate").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("enddate").value, "MM-dd-yyyy") || '01/01/1900',
      "Supplier_Id": this._WorkOrderService.myFormGroup.get("SupplierName").value.SupplierId  || 0
    }
   console.log(m_data);
    this._WorkOrderService.getWorkOrderList(m_data).subscribe(data => {
      this.dsWorkOrderList.data = data as WorkOrderList[];
      this.dsWorkOrderList.sort = this.sort;
      this.dsWorkOrderList.paginator = this.paginator;
      console.log(this.dsWorkOrderList.data);
      this.sIsLoading = '';
    },
      error => {
      this.sIsLoading = '';
      });

  }

  getCellCalculation(element, Qty) {
 //   this.Qty = parseInt(Qty);
    element.Qty = parseInt(element.Qty);
      this.Qty = parseInt(element.Qty);

      if (parseFloat(element.Qty) >0) {
    
      element. NetAmount = (parseFloat(element.Rate) * parseInt(this.Qty)).toFixed(2);
      element.DiscAmt = ((parseFloat(this.NetAmount) * parseFloat(element.Disc)) / 100).toFixed(2);
      element.GSTAmt = ((parseFloat(element.NetAmount) * (parseFloat(element.GST)) / 100) * parseInt(this.Qty)).toFixed(2);
      element.TotalAmount = ((parseFloat(element.Rate) * parseInt(this.Qty)) - (parseFloat(this.DiscAmt))).toFixed(2);
    }
  }
 

  
  viewgetWorkorderReportPdf(row) {
    debugger
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      
   this._WorkOrderService.getWorkorderreportview(
    row.WOId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Work ORDER Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
       
    });
   
    },100);
  }



  // getPrint(el) {
    
  //   var m_data = {
  //     "WOID":311
  //   }
  //  console.log(m_data);
  //   this._WorkOrderService.getWorkOrderPrint(m_data).subscribe(data => {
  //       this.reportPrintObjList = data as WorkOrderList[];
  //       this.reportPrintObj = data[0] as WorkOrderList;
  //       console.log(this.reportPrintObjList);
  //     })
  //     setTimeout(() => {
  //       this.print3();
  //     }, 1000);
    
  // }


  // print3() {
  //   let popupWin, printContents;
   
  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
  //   popupWin.document.write(` <html>
  //   <head><style type="text/css">`);
  //   popupWin.document.write(`
  //     </style>
  //     <style type="text/css" media="print">
  //   @page { size: portrait; }
  // </style>
  //         <title></title>
  //     </head>
  //   `);
  //   popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.WorkorderTemplate.nativeElement.innerHTML}</body>
  //   <script>
  //     var css = '@page { size: portrait; }',
  //     head = document.head || document.getElementsByTagName('head')[0],
  //     style = document.createElement('style');
  //     style.type = 'text/css';
  //     style.media = 'print';
  
  //     if (style.styleSheet){
  //         style.styleSheet.cssText = css;
  //     } else {
  //         style.appendChild(document.createTextNode(css));
  //     }
  //     head.appendChild(style);
  //   </script>
  //   </html>`);
  //   // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
  //   // </html>`);
    
  //   popupWin.document.close();
  // }



  onChangeStatus3(event) {
    
    if (event.value.name == 'GST Before Disc') {

      if (parseFloat(this.GST) > 0) {

        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST After Disc') {
      

      let disc = this._WorkOrderService.NewWorkForm.get('Disc').value
      if (disc > 0) {
        this.DisAmount = (disc * parseFloat(this.TotalAmount) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(4);
        if (parseFloat(this.GST) > 0) {
          this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(4);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
        }
      }
      else {
        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST On Pur +FreeQty') {
      if (parseFloat(this.GST) > 0) {

        let TotalQty = parseInt(this.Qty)
        this.TotalAmount = (parseFloat(this.Rate) * TotalQty).toFixed(2);
        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST OnMRP') {
      this.TotalAmount = (parseFloat(this.Rate) * this.Qty).toFixed(2);
      this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);

    }
    else if (event.value.name == 'GST After 2Disc') {
    }
  }


  OnAdd(){
      this.WorkOrderlist.push(
        {
          ItemName:this.ItemName,
          Qty:this.Qty,
          Rate:this.Rate,
          TotalAmount:this.TotalAmount,
          Disc:this.Disc,
          DiscAmt:this.DiscAmt,
          GST:this.GST,
          GSTAmt:this.GSTAmt,
          NetAmount:this.NetAmount,
          Specification:this.Specification
        });
     // console.log(this.WorkOrderlist);
      this.NewWorkOrderList.data = this.WorkOrderlist;
      this.NewWorkOrderList.sort = this.sort;
      this.NewWorkOrderList.paginator = this.paginator;
      //this.ItemFormreset(); 
  }
  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
      let index = this.WorkOrderlist.indexOf(element);
      if (index >= 0) {
        this.WorkOrderlist.splice(index, 1);
        this.NewWorkOrderList.data = [];
        this.NewWorkOrderList.data = this.WorkOrderlist;
      }
     // Swal.fire('Success !', 'Service Row Deleted Successfully', 'success');
      this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        toastClass: 'tostr-tost custom-toast-success',
      });

    // }
  }



  onEditRow(row){
    var m_data = {
      Qty:row.Qty,
      Rate:row.Rate
     
  };
  this._WorkOrderService.populateForm(m_data);

  }
  //ts toggle function: 
  editMode:any;
  editableColumn:any;
toggleEdit(index){
  this.editMode=false;
  this.editableColumn=index;
 
}



  newWorkorder() {
    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getWorkOrdersList();
    });
  }
  onEdit(contact) {
    console.log(contact)
    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getWorkOrdersList();
    });
  }
}
export class NewWorkOrderList {
  ItemName: any;
  Qty: any;
  Rate: number;
  TotalAmount: number;
  Disc: number;
  DiscAmt: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  Specification:string;

  constructor(NewWorkOrderList) {
    {
      this.ItemName = NewWorkOrderList.ItemName || "";
      this.Qty = NewWorkOrderList.Qty || 0;
      this.Rate = NewWorkOrderList.Rate || 0;
      this.TotalAmount = NewWorkOrderList.TotalAmount || "";
      this.Disc = NewWorkOrderList.Disc || 0;
      this.DiscAmt = NewWorkOrderList.DiscAmt || 0;
      this.GST = NewWorkOrderList.GST || 0;
      this.GSTAmount = NewWorkOrderList.GSTAmount || 0;
      this.NetAmount = NewWorkOrderList.NetAmount || 0;
      this.Specification =NewWorkOrderList.Specification || "";
    }
  }
}

export class WorkOrderList {
  Date: Number;
  WOId: any;
  WoNo: number;
  TotalAmt: number;
  SupplierName: string;
  DiscAmt: number;
  VatAmt: number;
  NetAmt: number;
  Remark: string;
  // WOId:any;
  StoreName:any;
  WODate:any;
  WOTotalAmount:any;
  WOVatAmount:any;
  WODiscAmount:any;
  WoNetAmount:any;
  WORemark:any;
  StoreId:any;
  Mobile:any;
   Phone:any;
  Address:any;
  AddedbyName:any;
  // ItemName:any;
  // Qty:any;
  // Rate:any;
  
  GST:any;
   DiscPer:any;
  constructor(WorkOrderList) {
    {
      this.Date = WorkOrderList.Date || 0;
      this.WOId = WorkOrderList.WOId || 0;
      this.WoNo = WorkOrderList.WoNo || 0;
      this.TotalAmt = WorkOrderList.TotalAmt || 0;
      this.SupplierName = WorkOrderList.SupplierName || "";
      this.DiscAmt = WorkOrderList.DiscAmt || 0;
      this.VatAmt = WorkOrderList.VatAmt || 0;
      this.NetAmt = WorkOrderList.NetAmt || 0;
      this.Remark = WorkOrderList.Remark || "";

    }
  }
}

