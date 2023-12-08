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
    'action',
    'WOId',
    'Date',
    'SupplierName',
    'WOTotalAmount',
    'WOVatAmount',
    'WODiscAmount',
    'WoNetAmount',
    'Remark'
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
    this.getSuppliernameList();
 
  }
  Status3List = [
    { id: 1, name: "GST Before Disc" },
    { id: 2, name: "GST After Disc" },
    { id: 3, name: "GST On Pur +FreeQty" },
    { id: 4, name: "GST OnMRP" },
    { id: 5, name: "GST After 2Disc" }
  ];

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
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
      this._WorkOrderService.NewWorkForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getSuppliernameList() {
    this._WorkOrderService.getSupplierList().subscribe(data => {
      this.SupplierList = data;
     // console.log(this.SupplierList);
      this._WorkOrderService.myFormGroup.get('SupplierName').setValue(this.SupplierList[0]);
      this._WorkOrderService.NewWorkForm.get('SupplierName').setValue(this.SupplierList[0]);
    });
  }

  getWorkOrdersList() {
    debugger
     this.sIsLoading = 'loading-data';
    var m_data = {
      "ToStoreId": 10003,//this._WorkOrderService.myFormGroup.get("StoreId").value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("startdate").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("enddate").value, "MM-dd-yyyy") || '01/01/1900',
      "Supplier_Id": 194// this._WorkOrderService.myFormGroup.get("SupplierName").value.SupplierId  || 0

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

  // getSearchItemList() {
  //   var m_data = {
  //     "ItemName": `${this._WorkOrderService.NewWorkForm.get('ItemID').value}%`
  //     // "ItemID": 1//this._IssueToDep.userFormGroup.get('ItemID').value.ItemID || 0 
  //   }
  //   // console.log(m_data);
  //   if (this._WorkOrderService.NewWorkForm.get('ItemID').value.length >= 2) {
  //     this._WorkOrderService.getItemlist(m_data).subscribe(data => {
  //       this.filteredOptionsItem = data;
  //       // console.log(this.filteredOptionsItem.data);
  //       this.filteredOptionsItem = data;
  //       if (this.filteredOptionsItem.length == 0) {
  //         this.noOptionFound = true;
  //       } else {
  //         this.noOptionFound = false;
  //       }
  //     });
  //   }
  // }
  // getOptionItemText(option) {
  //   this.ItemId = option.ItemID;
  //   if (!option) return '';
  //   return option.ItemID + ' ' + option.ItemName ;
  // }
  // getSelectedObjItem(obj) {
  //  // console.log(obj);

  // } 
  

  @ViewChild('qty') qty: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('Vat') Vat: ElementRef;
  @ViewChild('specification') specification: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  
  @ViewChild('Remark1') Remark1: ElementRef;
  @ViewChild('FinalDiscAmount1') FinalDiscAmount1: ElementRef;

  @ViewChild('GSTAmount1') GSTAmount1: ElementRef;
  @ViewChild('VatAmount1') VatAmount1: ElementRef;
  @ViewChild('FinalGSTAmt') FinalGSTAmt: ElementRef;
  @ViewChild('FinalTotalAmt') FinalTotalAmt: ElementRef;
  @ViewChild('FinalDiscAmt') FinalDiscAmt :ElementRef;
  @ViewChild('FinalNetAmount') FinalNetAmount :ElementRef;
  
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }
  public onEnterDiscAmount(event): void {
    if (event.which === 13) {
      this.GSTAmount1.nativeElement.focus();
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
      this.Vat.nativeElement.focus();
    }
  }
  
  public onEnterGSTAmount(event): void {
    if (event.which === 13) {
      this.FinalTotalAmt.nativeElement.focus();
    }
  }
  
  
  public onEnterTotalAmount(event): void {
    if (event.which === 13) {
      this.VatAmount1.nativeElement.focus();
    }
  }

  // calculateTotalAmount(element) {
  //   debugger
  //   element.Rate = parseInt(element.Rate);
  //   this.Rate = parseInt(element.Rate);
  //   if (this.Rate && this.Qty) {
  //     this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(4);
  //     this.NetAmount = this.TotalAmount;
  //     // this.calculatePersc();
  //   }
  // }

  calculateTotalAmount(){
    if (this.Rate && this.Qty) {
          this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(4);
          this.NetAmount = this.TotalAmount;
  }
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
  getRateCalculation(element,Rate){
    
  }

  getPrint(el) {
    
    var m_data = {
      "ToStoreId": 10003,//this._WorkOrderService.myFormGroup.get("StoreId").value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("startdate").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("enddate").value, "MM-dd-yyyy") || '01/01/1900',
      "Supplier_Id": 194// this._WorkOrderService.myFormGroup.get("SupplierName").value.SupplierId  || 0

    }
   console.log(m_data);
    this._WorkOrderService.getWorkOrderList(m_data).subscribe(data => {
        this.reportPrintObjList = data as WorkOrderList[];
        
        this.reportPrintObj = data[0] as WorkOrderList;
        
        setTimeout(() => {
          this.print3();
        }, 1000);
      
      })
    
  }


  print3() {
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.WorkorderTemplate.nativeElement.innerHTML}</body>
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
    
    popupWin.document.close();
  }


  // calculateDiscAmount() {
  //   if (this.Disc) {
  //     this.NetAmount =  (parseFloat(this.NetAmount) - parseFloat(this.DiscAmt)).toFixed(2);
  //   }
  // }
  
  calculateDiscperAmount(){
   // debugger
    if (this.Disc) {
      let dis=this._WorkOrderService.WorkorderItemForm.get('Disc').value
      this.DiscAmt = (parseFloat(this.Disc) * parseFloat(this.TotalAmount) /100).toFixed(2);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = this.TotalAmount - this.DiscAmt;
  
    }
  }
  calculateGSTperAmount() {
  
    if (this.GST) {
    
      this.GSTAmt = ((parseFloat (this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(2);
      this.NetAmount =(parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(2);
      this._WorkOrderService.WorkorderItemForm.get('NetAmount').setValue(this.NetAmount);
   
    }
  }
 
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
      this.ItemFormreset(); 
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

  getFinalValues(element) {
    this.FinalNetAmount = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
    this.FinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.FinalDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    this.FinalGSTAmt = (element.reduce((sum, { GSTAmt }) => sum += +(GSTAmt || 0), 0)).toFixed(2);
    return this.FinalNetAmount;
  }

  newWorkorder() {
    //this.chkNewWorkorder=1;
    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          //    chkNewWorkorder:this.chkNewWorkorder
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  onEdit(contact) {
    // this.chkNewWorkorder=2;
    console.log(contact)
    this.advanceDataStored.storage = new SearchInforObj(contact);
    // this._PurchaseOrder.populateForm();
    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact,
          //   chkNewWorkorder:this.chkNewWorkorder
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  ItemFormreset() {
       this.ItemName= "";
        this.Qty= 1;
        this.Rate= 0;
        this.TotalAmount= 0;
        this.Disc= 0;
        this.DiscAmt= 0;
        this.GST= 0;
        this.GSTAmt= 0;
        this.NetAmount= 0;
       this.Specification= "";
       //this.Status3List = [];       
  }

  
 
 
    OnSave() {
      this.isLoadings = 'submit';
      let submissionObj = {};
      let workorderDetailInsertArray = [];
      let workorderHeaderInsertObj = {};
      
    
      workorderHeaderInsertObj['date'] = this.dateTimeObj.date;
      workorderHeaderInsertObj['time'] = this.dateTimeObj.time;
      workorderHeaderInsertObj['storeId'] =  this._loggedService.currentUserValue.user.storeId
      workorderHeaderInsertObj['supplierID'] = this._WorkOrderService.NewWorkForm.get('SupplierName').value.SupplierId || 0;
      workorderHeaderInsertObj['totalAmount'] = this.TotalAmount;
      workorderHeaderInsertObj['discAmount'] = this.DiscAmt;
      workorderHeaderInsertObj['vatAmount'] = this.GSTAmount;
      workorderHeaderInsertObj['netAmount'] = this.NetAmount;
      workorderHeaderInsertObj['isclosed'] = false;
      workorderHeaderInsertObj['remarks'] = this._WorkOrderService.NewWorkForm.get('Remark').value || '';
      workorderHeaderInsertObj['addedBy'] = this._loggedService.currentUserValue.user.id,
      workorderHeaderInsertObj['isCancelled'] =true,
      workorderHeaderInsertObj['isCancelledBy'] = 0;
      workorderHeaderInsertObj['woId'] = 0;
    
       submissionObj['workorderHeaderInsert'] = workorderHeaderInsertObj;
     
       this.NewWorkOrderList.data.forEach((element) => {
        let workorderDetailInsertObj = {};
       workorderDetailInsertObj['woId'] = 0;
       workorderDetailInsertObj['itemName'] = element.ItemName;
       workorderDetailInsertObj['qty'] = element.Qty;
       workorderDetailInsertObj['rate'] = element.Rate
       workorderDetailInsertObj['totalAmount'] = element.TotalAmount;
       workorderDetailInsertObj['discAmount'] = element.DiscAmt
       workorderDetailInsertObj['discPer'] = element.Disc
       workorderDetailInsertObj['vatAmount'] = element.GSTAmount;
       workorderDetailInsertObj['vatPer'] = element.GSTAmount;
       workorderDetailInsertObj['netAmount'] =element.GST;
       workorderDetailInsertObj['remark'] = element.Specification;
       workorderDetailInsertArray.push(workorderDetailInsertObj);
       });

       submissionObj['workorderDetailInsert'] = workorderDetailInsertArray;
       console.log(submissionObj);

       this._WorkOrderService.InsertWorkorderSave(submissionObj).subscribe(response => {
         console.log(response);
         if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          //  Swal.fire('Congratulations !', 'New  WorkOrder Saved Successfully  !', 'success').then((result) => {
          //    if (result.isConfirmed) {
          //      this._matDialog.closeAll();
          //    }   
          //  });
         } 
         else {
          this.toastr.error('New WorkOrder Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
         }
         this.ItemFormreset(); 
         this.isLoadings = '';
       },error => {
        this.toastr.error('New WorkOrder Data not saved !, Please check API error..', 'Error !', {
         toastClass: 'tostr-tost custom-toast-error',
       });
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

