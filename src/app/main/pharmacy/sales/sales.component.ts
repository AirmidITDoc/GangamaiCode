import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from './sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from './sale-popup/sale-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesComponent implements OnInit {

  ItemSubform: FormGroup;
  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
  dsIndentID = new MatTableDataSource<IndentID>();

  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  ConcessionReasonList: any = [];

  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any;
  IssQty: any;
  Bal: any;
  StoreName: any;
  GSTPer: any;
  MRP: any;
  DiscPer: any = 0;
  DiscAmt: any = 0;
  FinalDiscPer: any = 0;
  FinalDiscAmt: any = 0;
  NetAmt: any = 0;
  TotalMRP: any = 0;
  FinalTotalAmt: any;
  FinalNetAmount: any =0;
  FinalGSTAmt: any;

  ConShow: Boolean = false;
  ItemObj: IndentList;

  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
  disamt: any;
  msg: any;


  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];

  selectedSaleDisplayedCol = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'TotalMRP',
    'DiscAmt',
    'NetAmt',
    'buttons'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _salesService: SalesService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();
    // this.ItemObj=
  }

  // toggleSidebar(name): void {
  //   this._fuseSidebarService.getSidebar(name).toggleOpen();
  // }


  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: 0,
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer:'',
      FinalDiscAmt:'',
      FinalTotalAmt:'',
      FinalNetAmount:'',
      FinalGSTAmt:'',
      BalanceAmt:'',
      CashPay:['1']
    });
  }


  getConcessionReasonList() {
    this._salesService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
      // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
    })
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getPharItemList() {
    debugger
    var m_data = {
      "ItemName": `${this._salesService.IndentSearchGroup.get('ItemId').value}%`,
      "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid || 0
    }
    console.log(m_data)
    if (this._salesService.IndentSearchGroup.get('ItemId').value.length >= 2) {
      this._salesService.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }

  }

  getOptionText(option) {
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObj(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;
    
    this.getBatch();
  }


  // onclickrow(Param) {
  //   Swal.fire("Row selected :" + Param)
  //   console.log(Param);
  // }

  gePharStoreList() {
    debugger
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    console.log(vdata)
    this._salesService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._salesService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
    });
  }

  onClear() {

  }

  OnAdd() {
  
    this.sIsLoading = 'save';
    if (this.ItemName && (parseInt(this.Qty) != 0) && this.MRP > 0) {
      this.saleSelectedDatasource.data = [];
      this.Itemchargeslist.push(
        {
          ItemName: this.ItemName,
          BatchNo: this.BatchNo,
          BatchExpDate: this.BatchExpDate || '01/01/1900',
          Qty: this.Qty,
          UnitMRP: this.MRP,
          GSTPer: this._salesService.IndentSearchGroup.get('GSTPer').value || 0,
          TotalMRP: this.TotalMRP,
          DiscAmt: this.DiscAmt || 0,
          NetAmt: this.NetAmt,

        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;

    }
    this.ItemFormreset();
  }

  getBatch() {
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "700px",
        minWidth: '700px',
        width: '700px',
        height: '500px',
        disableClose: true,
        data: {
          "ItemId": this._salesService.IndentSearchGroup.get('ItemId').value.ItemId,
          "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);


      this.BatchNo = result.BatchNo;
      this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      this.MRP = result.UnitMRP;
      this.Qty = result.BalanceQty;
      this.Bal = result.BalanceAmt;
      this.StoreName = result.StoreName;
      this.GSTPer = result.GSTPer;
      this.TotalMRP = Math.round(this.Qty * this.MRP);
      this.NetAmt = this.TotalMRP;

      this.ItemObj = result;


    });

  
  }


  ItemFormreset(){

      this.BatchNo = "";
      this.BatchExpDate = "01/01/1900"
      this.MRP = 0;
      this.Qty = 0;
      this.Bal = 0;
      this.GSTPer = 0;
      this.TotalMRP = 0;
      this.NetAmt = 0;

  }


  getNetAmtSum(element) {
    debugger
    let netAmt;
    netAmt = element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0);
    this.FinalTotalAmt = netAmt;
    this.FinalNetAmount = this.FinalTotalAmt;

    // this.ItemSubform.get('FinalNetAmount').setValue(this.FinalTotalAmt)
    return netAmt;
  }

  calculateTotalAmt() {
    if (this.Qty && this.MRP) {
      this.TotalMRP = Math.round(parseInt(this._salesService.IndentSearchGroup.get('Qty').value) * parseInt(this._salesService.IndentSearchGroup.get('MRP').value)).toString();
      this.NetAmt = this.TotalMRP;

    }
  }

  calculateGSTAmt() {
    debugger
    let GST = this._salesService.IndentSearchGroup.get('GSTPer').value
    if (GST > 0) {
      let discAmt = Math.round((this.NetAmt * parseInt(GST)) / 100);
      this.DiscAmt = discAmt;
      this.NetAmt = parseInt(this.NetAmt) - (discAmt);
    }
  }

  getDiscAmount() {
    if (this.FinalDiscPer > 0) {
      let discAmt = Math.round((this.FinalTotalAmt * parseInt(this.FinalDiscPer)) / 100);

      this.FinalTotalAmt = this.FinalTotalAmt - discAmt;

    }

  }

  getFinalDiscperAmt(){
    let Disc = this.ItemSubform.get('FinalDiscPer').value
    // this.FinalDiscAmt=0
    if (Disc > 0) {
      
      this.FinalDiscAmt =  Math.round((this.FinalTotalAmt * parseInt(Disc)) / 100);
      this.FinalNetAmount = parseInt(this.FinalTotalAmt) - (this.FinalDiscAmt);
      this.ConShow = true
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount(){
    // this.FinalDiscPer=0;
    let Discamt = this.ItemSubform.get('FinalDiscAmt').value

    if(Discamt > 0 && Discamt  < this.FinalNetAmount){
      this.FinalNetAmount = parseInt(this.FinalNetAmount) - (Discamt);
      this.ConShow = true
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }




  CalfinalGST(){
    let GST = this.ItemSubform.get('FinalGSTAmt').value
    if (GST > 0 && GST < this.FinalNetAmount) {
    this.FinalNetAmount = parseInt(this.FinalNetAmount) - parseInt(GST);
    this.ConShow = true
    }
    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  deleteTableRow(element) {

    // Delete row in datatable level
    let index = this.Itemchargeslist.indexOf(element);
    if (index >= 0) {
      this.Itemchargeslist.splice(index, 1);
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = this.Itemchargeslist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
  }

  onSave() {

    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] ="AirMid" ;//this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = '007';
    PatientHeaderObj['NetPayAmount'] = '9877777';


    if (!this.ItemSubform.get('cashpay').value) {
      const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "100vw",
          height: '600px',
          width: '100%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "OP-Bill"
          }
        });

      dialogRef.afterClosed().subscribe(result => {

        this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
        this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
        this.flagSubmit = result.IsSubmitFlag

   
        if (this.flagSubmit == true) {
          console.log("Procced with Payment Option");
          const insertBillUpdateBillNo = new IndentList(IndentList);
          let submitData = {
            // "chargesDetailInsert": InsertAdddetArr,
            // "insertBillupdatewithbillno": insertBillUpdateBillNo,
            // "opBillDetailsInsert": Billdetsarr,
            // "opCalDiscAmountBill": opCalDiscAmountBill,
            // "opInsertPayment": result.submitDataPay.ipPaymentInsert
          };
          console.log(submitData);
          this._salesService.InsertSales(submitData).subscribe(response => {
            if (response) {
              Swal.fire('Sale!', 'Data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  let m = response;
                  // this.getPrint(m);
                  this._matDialog.closeAll();
                }
              });
            } else {
              Swal.fire('Error !', 'Sale data not saved', 'error');
            }
            this.sIsLoading = '';
          });
        }
      
      });
    }
   }
  onClose() {
    // this.dialogRef.close({ result: "cancel" });
  }
}

export class IndentList {
  ItemId: any;
  ItemName: string;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  UnitMRP: any;
  Qty: number;
  IssQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  TotalMRP: any;
  DiscAmt: any;
  NetAmt: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';

      this.GSTPer = IndentList.GSTPer || "";
      this.TotalMRP = IndentList.TotalMRP || 0;
      this.DiscAmt = IndentList.IssQty || 0;
      this.NetAmt = IndentList.NetAmt || 0;

    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

