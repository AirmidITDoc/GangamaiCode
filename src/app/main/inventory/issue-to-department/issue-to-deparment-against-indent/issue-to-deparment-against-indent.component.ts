import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IssueToDepartmentService } from '../issue-to-department.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IssueItemList, NewIssueList3 } from '../issue-to-department.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';

@Component({
  selector: 'app-issue-to-deparment-against-indent',
  templateUrl: './issue-to-deparment-against-indent.component.html',
  styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
  NewIssueGroup: FormGroup;
  IssueFinalForm: FormGroup;
  StoreFrom: FormGroup;
  displayedNewIssuesList1: string[] = [
    'ItemName',
    'Qty',
    'Action'
  ]
  displayedNewIssuesList2: string[] = [
    'BatchNo',
    'ExpDateNo',
    'BalQty'
  ]
  displayedNewIssuesList3: string[] = [
    'ItemId',
    'ItemName',
    'BatchNO',
    'ExpDate',
    'BalanceQty',
    'Qty',
    'UnitRate',
    'GSTPer',
    'GSTAmount',
    'TotalAmount',
    'Action'
  ];
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;

  Charglist: any = [];
  vIndentId: any;
  vIndtDetId: any;
  vFinalTotalAmount: any;
  vFinalNetAmount: any;
  vFinalGSTAmount: any;
  vTotalAmount: any;
  vQty: any;
  vBalanceQty: any;
  vLandedRatee: any;
  vremark: any;
  vLandedRate: any;

  vBatchNo: any;
  vBarcode: any;

  
  vBatchExpDate: any;
  vUnitMRP: any;
  IssQty: any;
  vBal: any;
  StoreName: any;
  GSTPer: any;
  vMRP: any;
  vVatPer: any;
  vCgstPer: any;
  vSgstPer: any;
  vIgstPer: any;
  vVatAmount: any;
  vStockId: any;
  vStoreId: any;
  vPurchaseRate: any;
  ItemName: any
  vItemID: any
  vTotalMRP: any = 0;
  vDiscAmt: any
  vNetAmt: any
  vItemObj: NewIssueList3;
  chargeslist: any = [];

  Addflag: boolean = false;
  vAgainstIndet: boolean = false;
  autocompletestore: string = "Store";
  dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();
  dsNewIssueList1 = new MatTableDataSource<IssueItemList>();
  dsIndentList = new MatTableDataSource<IndentList>();
  dsIndentItemDetList = new MatTableDataSource<IndentItemDetList>();
  dstempdata = new MatTableDataSource<IndentItemDetList>();

  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public _IssueToDep: IssueToDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _dialogRef: MatDialogRef<IssueToDeparmentAgainstIndentComponent>,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.NewIssueGroup = this._IssueToDep.getNewIssueForm();
    this.IssueFinalForm = this._IssueToDep.createfinal()
    this.StoreFrom = this._IssueToDep.CreateStoreFrom();

    this.IssueFinalForm.markAllAsTouched();
    this.StoreFrom.markAllAsTouched();

  }


  dsTempItemNameList = new MatTableDataSource<NewIssueList3>();
  vsaveflag: boolean = true;
  onAdd($event) {

    // if (this.vBarcode == 0) {

    //     if ((this.vItemID == '' || this.vItemID == null || this.vItemID == undefined)) {
    //         this.toastr.warning('Please enter a item', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
    //         this.toastr.warning('Please enter a Qty', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }

    // this.ItemSamelist = this.dsNewIssueList3.data.filter(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId)
    // if (this.ItemSamelist) {
    //     if (this.ItemSamelist.some(item => item.BatchNo === this.vBatchNo) && this.ItemSamelist.some(item => item.LandedRate === this.vLandedRate)) {
    //         this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }
    // this.BatchSamelist = this.dsNewIssueList3.data.filter(item => item.BatchNo === this.vBatchNo)
    // if (this.BatchSamelist) {
    //     if (this.BatchSamelist.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId) && this.BatchSamelist.some(item => item.LandedRate === this.vLandedRate)) {
    //         this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }
    // this.MRPSamelist = this.dsNewIssueList3.data.filter(item => item.LandedRate === this.vLandedRate)
    // if (this.MRPSamelist) {
    //     if (this.MRPSamelist.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId) && this.MRPSamelist.some(item => item.BatchNo === this.vBatchNo)) {
    //         this.toastr.warning('Selected Item already added with same Batch &  same MRP in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }

    // if (!this.vBarcodeflag) {
    // const isDuplicate = this.dsNewIssueList3.data.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId);
    // if (!isDuplicate) {
    let gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));

    this.chargeslist = this.dsTempItemNameList.data;
    // if (this.dsNewIssueList3.data.length > 0) {
    //   this.chargeslist = this.dsNewIssueList3.data;
    // } 
    let TotalMRP = this.NewIssueGroup.get("Qty").value  * this.NewIssueGroup.get("UnitRate").value 
    let PurTotAmt = this.vPurchaseRate * this.NewIssueGroup.get("Qty").value

    let LandedRateandedTotal = this.NewIssueGroup.get("UnitRate").value  * this.NewIssueGroup.get("Qty").value

    let GSTAmount = (((this.NewIssueGroup.get("UnitRate").value ) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(2);
    // let  CGSTAmt = (((contact.LandedRate) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    // let  SGSTAmt = (((contact.LandedRate) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    // let  IGSTAmt = (((contact.LandedRate) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2); 

debugger
    this.chargeslist.push(
      {
        ItemId: this.NewIssueGroup.get('ItemName').value.itemId || 0,
        ItemName: this.NewIssueGroup.get('ItemName').value.formattedText || '',
        BatchNo:this.NewIssueGroup.get('BatchNO').value || "",
        BatchExpDate: this.vBatchExpDate || '01/01/1900',
        BalanceQty: this.NewIssueGroup.get('BalanceQty').value || "",
        Qty:this.NewIssueGroup.get('Qty').value || 0,
        LandedRate: this.NewIssueGroup.get("UnitRate").value  ,
        UnitMRP: this.NewIssueGroup.get("UnitRate").value || 0,
        VatPer: gstper || 0,
        VatAmount: (((this.vTotalAmount) * (gstper)) / 100).toFixed(2),
        TotalAmount: this.vTotalAmount || 0,
        StockId: this.vStockId,
        TotalMRP: TotalMRP,
        DiscPer: 0,// contact.DiscPer || 0,
        DiscAmt: 0,
        NetAmt: LandedRateandedTotal,
        RoundNetAmt: Math.round(LandedRateandedTotal),// Math.round(TotalNet),
        mrpTotalAmount: TotalMRP,

        //LandedRate: this.vLandedRate,
        LandedRateandedTotal: LandedRateandedTotal,
        CgstPer: this.vCgstPer,
        //   CGSTAmt: CGSTAmt,
        SgstPer: this.vSgstPer,
        //   SGSTAmt: SGSTAmt,
        IgstPer: this.vIgstPer,
        //   IGSTAmt: IGSTAmt,
        PurchaseRate: this.vPurchaseRate,
        PurTotAmt: PurTotAmt,
        purTotalAmount: PurTotAmt,
        //   MarginAmt: v_marginamt,
        SalesDraftId: 1
      });
    console.log(this.chargeslist);
    this.dsNewIssueList3.data = this.chargeslist

    // }

    this.ItemReset();
    // this.itemid.nativeElement.focus();
    this.NewIssueGroup.get('ItemName').setValue('');
    this.Addflag = false;

    if (!(this.NewIssueGroup.invalid) && this.dsNewIssueList3.data.length > 0) {
      this.vsaveflag = false;
    }
  }

  getBatch() {
    // this.Quantity.nativeElement.focus();
    const dialogRef = this._matDialog.open(SalePopupComponent,
        {
            maxWidth: "800px",
            minWidth: '800px',
            width: '800px',
            height: '380px',
            disableClose: true,
            data: {
                "ItemId": this.NewIssueGroup.get('ItemName').value.itemId,
                "StoreId": this.NewIssueGroup.get('FromStoreId').value
            }
        });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        result = result.selectedData
        this.vBatchNo = result.batchNo;
        this.vBatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
        this.vMRP = result.landedRate;
        this.vQty = '';
        this.vBal = result.BalanceAmt;
        this.GSTPer = result.VatPercentage;
        this.vTotalMRP = this.vQty * this.vLandedRate;
        this.vDiscAmt = 0;
        this.vNetAmt = this.vTotalMRP;
        this.vBalanceQty = result.BalanceQty;
        this.vItemObj = result;
        this.vVatPer = result.VatPercentage;
        this.vCgstPer = result.CGSTPer;
        this.vSgstPer = result.SGSTPer;
        this.vIgstPer = result.IGSTPer;
        this.vVatAmount = result.VatPercentage;
        this.vStockId = result.StockId
        this.vStoreId = result.StoreId;
        this.vLandedRate = result.LandedRate;
        this.vPurchaseRate = result.PurchaseRate;
        this.vUnitMRP = result.unitMRP;
    });
}

  ItemReset() {
    this.ItemName = " ";
    this.vItemID = 0;
    this.vBatchNo = " ";
    this.vBalanceQty = 0;
    this.vQty = 0;
    this.vLandedRate = 0;
    this.vTotalAmount = 0;
  }
  CalculateTotalAmt() {
    debugger
    // if (this.vQty > this.vBalanceQty) {
      if (this.NewIssueGroup.get("Qty").value > this.NewIssueGroup.get("BalanceQty").value) {
      this.toastr.warning('Enter Qty less than Balance', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this._IssueToDep.NewIssueGroup.get('Qty').setValue(0);
    }
    if (this.NewIssueGroup.get("Qty").value && this.NewIssueGroup.get("UnitRate").value) {
      this.vTotalAmount = (parseFloat(this.NewIssueGroup.get("Qty").value) * parseFloat(this.NewIssueGroup.get("UnitRate").value)).toFixed(2);
    }
  }
  getTotalamt(element) {
    this.vFinalTotalAmount = (element.reduce((sum, { LandedRateandedTotal }) => sum += +(LandedRateandedTotal || 0), 0)).toFixed(2);
    this.vFinalGSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vFinalNetAmount = (parseFloat(this.vFinalGSTAmount) + parseFloat(this.vFinalTotalAmount)).toFixed(2);
    return this.vFinalTotalAmount;
  }
  AgainstInd: boolean = true;
  getAgainstIndet(event) {
    if (event.checked == true) {
      this.AgainstInd = false;
    } else {
      this.AgainstInd = true;
    }

  }
  ItemID = 0;
  getSelectedItem(item: GRNItemResponseType): void {

    this.ItemID = item.itemId
    // if (this.mock) {
    //     return;
    // }
    this.NewIssueGroup.patchValue({
      UOMId: item.umoId,
      ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      Qty: item.balanceQty,
      CGSTPer: item.cgstPer,
      SGSTPer: item.sgstPer,
      IGSTPer: item.igstPer,
      GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode

    });
    // if (this.BalanceQty > 0) {
      this.getBatch();
  // }
  }


  OnSave() {
    if (this.vIndentId > 0) {
      this.OnSaveAgaintIndent();
    } else {
      this.OnNewSave();
    }
  }
  Isclosedchk: any;
  savebtn: boolean = false;
  OnNewSave() {

    if ((!this.dsNewIssueList3.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vTostoreId == '' || this.vTostoreId == null || this.vTostoreId == undefined)) {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }

    const isChecked = 0//this.ToStoreList.some(item => item.StoreName === this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreName);
    if (isChecked) {
      this.savebtn = true;
      // let insertheaderObj = {};
      // insertheaderObj['issueDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
      //   insertheaderObj['issueTime'] = this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
      //   insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
      // insertheaderObj['toStoreId'] = this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
      // insertheaderObj['totalAmount'] = this._IssueToDep.IssueFinalForm.get('FinalTotalAmount').value || 0;
      // insertheaderObj['totalVatAmount'] = this._IssueToDep.IssueFinalForm.get('GSTAmount').value || 0;
      // insertheaderObj['netAmount'] = this._IssueToDep.IssueFinalForm.get('FinalNetAmount').value || 0;
      // insertheaderObj['remark'] = this._IssueToDep.IssueFinalForm.get('Remark').value || '';
      // insertheaderObj['addedby'] = this._loggedService.currentUserValue.user.id || 0;
      // insertheaderObj['isVerified'] = false;
      // insertheaderObj['isclosed'] = false;
      // insertheaderObj['indentId'] = 0;
      // insertheaderObj['issueId'] = 0;

      let isertItemdetailsObj = [];
      this.dsNewIssueList3.data.forEach(element => {
        console.log(element)

        let insertitemdetail = {};
        insertitemdetail['issueId'] = 0;
        insertitemdetail['itemId'] = element.ItemId;
        insertitemdetail['batchNo'] = element.BatchNo;
        insertitemdetail['batchExpDate'] = element.BatchExpDate;
        insertitemdetail['issueQty'] = element.Qty;
        insertitemdetail['perUnitLandedRate'] = element.LandedRate;
        insertitemdetail['LandedTotalAmount'] = element.LandedRateandedTotal;
        insertitemdetail['unitMRP'] = element.UnitMRP;
        insertitemdetail['mrpTotalAmount'] = element.TotalMRP;
        insertitemdetail['unitPurRate'] = element.PurchaseRate;
        insertitemdetail['purTotalAmount'] = element.PurTotAmt;
        insertitemdetail['vatPercentage'] = element.VatPer || 0;
        insertitemdetail['vatAmount'] = element.VatAmount || 0;
        insertitemdetail['stkId'] = element.StockId;
        isertItemdetailsObj.push(insertitemdetail);
      });
      // let updateissuetoDepartmentStock = [];
      // this.dsNewIssueList3.data.forEach(element => {
      //   let updateitemdetail = {};
      //   updateitemdetail['itemId'] = element.ItemId;
      //   updateitemdetail['issueQty'] = element.Qty;
      //   updateitemdetail['stkId'] = element.StockId;
      //   updateitemdetail['storeID'] = this._loggedService.currentUserValue.user.storeId;
      //   updateissuetoDepartmentStock.push(updateitemdetail);
      // });

      let submitData = {
       "issueId": 0,
        "issueDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        "issueTime": this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
        "fromStoreId":this._loggedService.currentUserValue.user.storeId,
        "toStoreId": this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0,
        "totalAmount": this._IssueToDep.IssueFinalForm.get('FinalTotalAmount').value || 0,
        "totalVatAmount":this._IssueToDep.IssueFinalForm.get('GSTAmount').value || 0,
        "netAmount": this._IssueToDep.IssueFinalForm.get('FinalNetAmount').value || 0,
        "remark": this._IssueToDep.IssueFinalForm.get('Remark').value || '',
        "addedby":this._loggedService.currentUserValue.user.id || 0,
        "isVerified": false,
        "isClosed": false,
        "indentId": 0,
        tIssueToDepartmentDetails: isertItemdetailsObj
      };

      console.log(submitData);

      this._IssueToDep.IssuetodepSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
        if (response) {
          // this.viewgetPurchaseorderReportPdf(response)
          this._matDialog.closeAll();
        }

      });
    }
  }
  OnSaveAgaintIndent() {

    this.vsaveflag = true;
    if ((!this.dsNewIssueList3.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vTostoreId == '' || this.vTostoreId == null || this.vTostoreId == undefined)) {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    const isChecked = 0//this.ToStoreList.some(item => item.StoreName === this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreName);
    if (isChecked) {
      this.savebtn = true;
      let insertheaderObj = {};
      insertheaderObj['issueDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        insertheaderObj['issueTime'] = this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
        insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
      insertheaderObj['toStoreId'] = this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
      insertheaderObj['totalAmount'] = this._IssueToDep.IssueFinalForm.get('FinalTotalAmount').value || 0;
      insertheaderObj['totalVatAmount'] = this._IssueToDep.IssueFinalForm.get('GSTAmount').value || 0;
      insertheaderObj['netAmount'] = this._IssueToDep.IssueFinalForm.get('FinalNetAmount').value || 0;
      insertheaderObj['remark'] = this._IssueToDep.IssueFinalForm.get('Remark').value || '';
      insertheaderObj['addedby'] = this._loggedService.currentUserValue.user.id || 0;
      insertheaderObj['isVerified'] = false;
      insertheaderObj['isclosed'] = false;
      insertheaderObj['indentId'] = this.vIndentId;
      insertheaderObj['issueId'] = 0;

      let isertItemdetailsObj = [];
      this.dsNewIssueList3.data.forEach(element => {
        console.log(element)

        let insertitemdetail = {};
        insertitemdetail['issueId'] = 0;
        insertitemdetail['itemId'] = element.ItemId;
        insertitemdetail['batchNo'] = element.BatchNo;
        insertitemdetail['batchExpDate'] = element.BatchExpDate;
        insertitemdetail['issueQty'] = element.Qty;
        insertitemdetail['perUnitLandedRate'] = element.LandedRate;
        insertitemdetail['LandedTotalAmount'] = element.LandedRateandedTotal;
        insertitemdetail['unitMRP'] = element.UnitMRP;
        insertitemdetail['mrpTotalAmount'] = element.TotalMRP;
        insertitemdetail['unitPurRate'] = element.PurchaseRate;
        insertitemdetail['purTotalAmount'] = element.PurTotAmt;
        insertitemdetail['vatPercentage'] = element.VatPer || 0;
        insertitemdetail['vatAmount'] = element.VatAmount || 0;
        insertitemdetail['stkId'] = element.StockId;
        isertItemdetailsObj.push(insertitemdetail);
      });

      let updateissuetoDepartmentStock = [];
      this.dsNewIssueList3.data.forEach(element => {

        let updateitemdetail = {};
        updateitemdetail['itemId'] = element.ItemId;
        updateitemdetail['issueQty'] = element.Qty;
        updateitemdetail['stkId'] = element.StockId;
        updateitemdetail['storeID'] = this._loggedService.currentUserValue.user.storeId;
        updateissuetoDepartmentStock.push(updateitemdetail);
      });

      let update_IndentHeader_StatusObj = {};
      update_IndentHeader_StatusObj['indentId'] = this.vIndentId;
      update_IndentHeader_StatusObj['isClosed'] = this.Isclosedchk;


      let updateIndentStatusIndentDetails = [];
      this.dsNewIssueList3.data.forEach(element => {
        debugger
        let balQty = (parseInt(element.IndQty) - parseInt(element.Qty))
        if (balQty == 0) {
          this.Isclosedchk = false;
        } else {
          this.Isclosedchk = true;
        }
        let updateIndentStatusIndentDetailsObj = {};
        updateIndentStatusIndentDetailsObj['indentId'] = element.IndentId;
        updateIndentStatusIndentDetailsObj['indDetID'] = element.IndentDetailsId;
        updateIndentStatusIndentDetailsObj['isClosed'] = this.Isclosedchk;
        updateIndentStatusIndentDetailsObj['indQty'] = balQty;
        updateIndentStatusIndentDetails.push(updateIndentStatusIndentDetailsObj);
      });

      let submitData = {
        "issueId": 0,
        "issueDate": "Unknown Type: DateTime",
        "issueTime": "string",
        "fromStoreId": 0,
        "toStoreId": 0,
        "totalAmount": 0,
        "totalVatAmount": 0,
        "netAmount": 0,
        "remark": "string",
        "addedby": 0,
        "isVerified": true,
        "isClosed": true,
        "indentId": 0,
        tIssueToDepartmentDetails: isertItemdetailsObj
      };

      console.log(submitData);

      this._IssueToDep.IssuetodepAgaintIndetSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
        if (response) {
          // this.viewgetPurchaseorderReportPdf(response)
          this._matDialog.closeAll();
        }

      });
    }
  }

  viewgetIssuetodeptReportPdf() {

  }
  onClose() {
    this._matDialog.closeAll();
  }
  OnReset() {
    this._matDialog.closeAll();
    this.NewIssueGroup.reset();
  }

  vstoreId: any = '';
  selectChangeStore(obj: any) {
    debugger
    console.log("Store:", obj);
    this.vstoreId = obj.value

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      StoreId: [
        { name: "required", Message: "Store Name is required" }
      ],
      // WardName: [
      //   { name: "required", Message: "Ward Name is required" }
      // ],
      // ItemId: [
      //   { name: "required", Message: "Item Name is required" }
      // ],
      // Qty: [
      //   { name: "required", Message: "Qty is required" },
      //   { name: "pattern", Message: "Only numbers allowed" }
      // ],
    };
  }
}
export class IndentList {
  IndentNo: any;
  IndentDate: any;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: any;
  IndentId: any;
  constructor(IndentList) {
    {
      this.IndentNo = IndentList.IndentNo || 0;
      this.IndentDate = IndentList.IndentDate || 0;
      this.FromStoreName = IndentList.FromStoreName || '';
      this.ToStoreName = IndentList.ToStoreName || '';
      this.Addedby = IndentList.Addedby || 0;
      this.IndentId = IndentList.IndentId || 0;
    }
  }
}
export class IndentItemDetList {
  IndentNo: any;
  IndentDate: any;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: any;
  IndentId: any;
  constructor(IndentItemDetList) {
    {
      this.IndentNo = IndentItemDetList.IndentNo || 0;
      this.IndentDate = IndentItemDetList.IndentDate || 0;
      this.FromStoreName = IndentItemDetList.FromStoreName || '';
      this.ToStoreName = IndentItemDetList.ToStoreName || '';
      this.Addedby = IndentItemDetList.Addedby || 0;
      this.IndentId = IndentItemDetList.IndentId || 0;
    }
  }
}
