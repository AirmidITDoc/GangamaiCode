import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IssueToDepartmentService } from '../issue-to-department.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatSort } from '@angular/material/sort';
import { IssueItemList, NewIssueList3 } from '../issue-to-department.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { IssueToDeparmentAgainstIndentComponent } from '../issue-to-deparment-against-indent/issue-to-deparment-against-indent.component';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issu-todept',
  templateUrl: './issu-todept.component.html',
  styleUrls: ['./issu-todept.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssuTodeptComponent {
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
    public toastr: ToastrService
    , private commonService: PrintserviceService,
    public _dialogRef: MatDialogRef<IssuTodeptComponent>,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.NewIssueGroup = this._IssueToDep.getNewIssueForm();
    this.IssueFinalForm = this._IssueToDep.createfinal()
    this.StoreFrom = this._IssueToDep.CreateStoreFrom();

    this.IssueFinalForm.markAllAsTouched();
    this.StoreFrom.markAllAsTouched();

    if (this.data) {
      console.log(this.data)
      this.dsNewIssueList1.data = this.data
    }

  }


  dsTempItemNameList = new MatTableDataSource<NewIssueList3>();
  vsaveflag: boolean = true;
  onAdd($event) {

    // if (this.vBarcode == 0) {

    if (!this.NewIssueGroup.get('ItemName')?.value) {
      this.toastr.warning('Please select Item', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.NewIssueGroup.get('Qty')?.value) {
      this.toastr.warning('Please select Qty', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    // this.ItemSamelist = this.dsNewIssueList3.data.filter(item => item.ItemId === this.NewIssueGroup.get('ItemID').value.ItemId)
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
    //     if (this.BatchSamelist.some(item => item.ItemId === this.NewIssueGroup.get('ItemID').value.ItemId) && this.BatchSamelist.some(item => item.LandedRate === this.vLandedRate)) {
    //         this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }
    // this.MRPSamelist = this.dsNewIssueList3.data.filter(item => item.LandedRate === this.vLandedRate)
    // if (this.MRPSamelist) {
    //     if (this.MRPSamelist.some(item => item.ItemId === this.NewIssueGroup.get('ItemID').value.ItemId) && this.MRPSamelist.some(item => item.BatchNo === this.vBatchNo)) {
    //         this.toastr.warning('Selected Item already added with same Batch &  same MRP in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    // }

    // if (!this.vBarcodeflag) {
    // const isDuplicate = this.dsNewIssueList3.data.some(item => item.ItemId === this.NewIssueGroup.get('ItemID').value.ItemId);
    // if (!isDuplicate) {
    let gstper = 0
    gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));

    this.chargeslist = this.dsTempItemNameList.data;
    // if (this.dsNewIssueList3.data.length > 0) {
    //   this.chargeslist = this.dsNewIssueList3.data;
    // } 
    let TotalMRP = this.NewIssueGroup.get("Qty").value * this.NewIssueGroup.get("UnitRate").value
    let PurTotAmt = this.vPurchaseRate * this.NewIssueGroup.get("Qty").value

    let LandedRateandedTotal = this.NewIssueGroup.get("UnitRate").value * this.NewIssueGroup.get("Qty").value

    let GSTAmount = (((this.NewIssueGroup.get("UnitRate").value) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(2);
    // let  CGSTAmt = (((contact.LandedRate) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    // let  SGSTAmt = (((contact.LandedRate) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    // let  IGSTAmt = (((contact.LandedRate) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2); 

    debugger
    this.chargeslist.push(
      {
        ItemId: this.NewIssueGroup.get('ItemName').value.itemId || 0,
        ItemName: this.NewIssueGroup.get('ItemName').value.formattedText || '',
        BatchNo: this.NewIssueGroup.get('BatchNO').value || "",
        BatchExpDate: this.vBatchExpDate || '1900-01-01',
        BalanceQty: this.NewIssueGroup.get('BalanceQty').value || "",
        Qty: this.NewIssueGroup.get('Qty').value || 0,
        LandedRate: this.NewIssueGroup.get("UnitRate").value,
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

    this.resetFormItem();
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
          "StoreId": this.StoreFrom.get('FromStoreId').value
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      result = result.selectedData
      this.vBatchNo = result.batchNo || '';
      this.vBatchExpDate = this.datePipe.transform(result.batchExpDate, "yyyy-MM-dd");
      this.vMRP = result.landedRate;
      this.vQty = '';
      this.vBal = result.BalanceAmt;
      this.GSTPer = result.VatPercentage;
      this.vTotalMRP = this.vQty * this.vLandedRate;
      this.vDiscAmt = 0;
      this.vNetAmt = this.vTotalMRP;
      this.vBalanceQty = result.balanceQty;
      this.vItemObj = result;
      this.vVatPer = result.vatPercentage;
      this.vCgstPer = result.cgstPer;
      this.vSgstPer = result.sgstPer;
      this.vIgstPer = result.igstPer;
      this.vVatAmount = (((this.vTotalAmount) * (this.vVatPer)) / 100).toFixed(2),
        this.vStockId = result.stockId
      this.vStoreId = result.storeId;
      this.vLandedRate = result.landedRate;
      this.vPurchaseRate = result.purchaseRate;
      this.vUnitMRP = result.unitMRP;
      // this.vTotalAmount=  this.vQty * this.vLandedRate;
    });
  }


  resetFormItem() {
    const form = this.NewIssueGroup;

    form.patchValue({
      Barcode: '',
      ItemName: '',
      ItemID: [''],
      BatchNO: '',
      BalanceQty: '',
      Qty: '',
      UnitRate: '',
      TotalAmount: '',
    });
    this.NewIssueGroup.markAsUntouched();
  }


  CalculateTotalAmt() {
    debugger

    if (this.NewIssueGroup.get("Qty").value > this.NewIssueGroup.get("BalanceQty").value) {
      this.toastr.warning('Enter Qty less than Balance', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.NewIssueGroup.get('Qty').setValue(0);
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

     if ((!this.dsNewIssueList3.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.StoreFrom.get("ToStoreId").value == 0)) {
      this.toastr.warning('Please select TostoreId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
    if (!this.IssueFinalForm.invalid) {

      if (this.vIndentId > 0) {
        this.OnSaveAgaintIndent();
      } else {
        this.OnNewSave();
      }
    } else {
      let invalidFields = [];

      if (this.IssueFinalForm.invalid) {
        for (const controlName in this.IssueFinalForm.controls) {
          if (this.IssueFinalForm.controls[controlName].invalid) {
            invalidFields.push(`IssueFinal Form : ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }
  Isclosedchk: any;
  savebtn: boolean = false;
  OnNewSave() {

    // if ((!this.dsNewIssueList3.data.length)) {
    //   this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.StoreFrom.get("ToStoreId").value == 0)) {
    //   this.toastr.warning('Please select TostoreId', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    const isChecked = 1// this.ToStoreList.some(item => item.StoreName === this.NewIssueGroup.get('ToStoreId').value.StoreName);


    if (isChecked) {
      let isertItemdetailsObj = [];
      this.dsNewIssueList3.data.forEach(element => {
        console.log(element)

        let insertitemdetail = {};
        insertitemdetail['issueDepId'] = 0;
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

      console.log(this.IssueFinalForm.value)

      // this.IssueFinalForm.get("toStoreId").setValue(this.StoreFrom.get("StoreFrom").value)
      // this.IssueFinalForm.get("toStoreId").setValue(this.StoreFrom.get("StoreFrom").value)

      //   this.IssueFinalForm.get("toStorissueDateeId").setValue(this.datePipe.transform(new Date(), "yyyy-MM-dd") || '1900-01-01')

      console.log(this.IssueFinalForm.value)
      //  this.IssueFinalForm.get("tIssueToDepartmentDetails").setValue(isertItemdetailsObj)
      //  this.IssueFinalForm.get("tCurrentStock").setValue(updateissuetoDepartmentStock)


      let submitData = {
        issue: {
          "issueId": 0,
          "issueDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
          "issueTime": this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
          "fromStoreId": this._loggedService.currentUserValue.user.storeId,
          "toStoreId": this.StoreFrom.get('ToStoreId').value || 0,
          "totalAmount": this.IssueFinalForm.get('FinalTotalAmount').value || 0,
          "totalVatAmount": this.IssueFinalForm.get('GSTAmount').value || 0,
          "netAmount": this.IssueFinalForm.get('FinalNetAmount').value || 0,
          "remark": this.IssueFinalForm.get('Remark').value || '',
          "addedby": this._loggedService.currentUserValue.user.id || 0,
          "isVerified": false,
          "isClosed": false,
          "indentId": 0,
          tIssueToDepartmentDetails: isertItemdetailsObj
        },
        tCurrentStock: updateissuetoDepartmentStock

      };

      console.log(submitData);

      this._IssueToDep.IssuetodepSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
        console.log(response)
        if (response) {
          this.viewgetIssuetodeptReportPdf(response)
          this._matDialog.closeAll();
        }

      });
    }
  }
  OnSaveAgaintIndent() {

    this.vsaveflag = true;
    // if ((!this.dsNewIssueList3.data.length)) {
    //   this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((this.StoreFrom.get("ToStoreId").value == 0)) {
    //   this.toastr.warning('Please select TostoreId', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    const isChecked = 1//this.ToStoreList.some(item => item.StoreName === this.NewIssueGroup.get('ToStoreId').value.StoreName);
    if (isChecked) {
      // this.savebtn = true;
      let insertheaderObj = {};
      insertheaderObj['issueDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        insertheaderObj['issueTime'] = this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
        insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
      insertheaderObj['toStoreId'] = this.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
      insertheaderObj['totalAmount'] = this.IssueFinalForm.get('FinalTotalAmount').value || 0;
      insertheaderObj['totalVatAmount'] = this.IssueFinalForm.get('GSTAmount').value || 0;
      insertheaderObj['netAmount'] = this.IssueFinalForm.get('FinalNetAmount').value || 0;
      insertheaderObj['remark'] = this.IssueFinalForm.get('Remark').value || '';
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


  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  viewgetIssuetodeptReportPdf(element) {
    this.commonService.Onprint("IssueId", element.issueId, "Issutodeptissuewise");
  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsNewIssueList3.data = [];
      this.dsNewIssueList3.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
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
  Itemchargeslist1: any = [];
  QtyBalchk: any = 0;
  Itemflag: boolean = false;

  OnIndent() {
    this.OnReset();
    const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.dsNewIssueList1.data = result;
      console.log(result)
      this.vIndentId = result[0].indentId;

      // const toSelectToStoreId = this.ToStoreList1.find(c => c.StoreId == result[0].FromStoreId);
      // this._IssueToDep.NewIssueGroup.get('ToStoreId').setValue(toSelectToStoreId);
      // console.log(this.vIndentId)
    });
  }

  //   OnReset() {
  //     this._IssueToDep.NewIssueGroup.reset();
  //     this.dsNewIssueList1.data = [];
  //     // this.dsNewIssueList2.data = [];
  //     this.dsNewIssueList3.data = [];
  //     // this.BarcodetempDatasource = [];
  //     // this.chargeslist.data = [];
  //     this.dsTempItemNameList.data = [];
  //     this._IssueToDep.IssueFinalForm.reset();
  // }


  AddIndentItem(contact) {
    console.log(contact)
    this.Indentid = contact.indentId;
    this.indentdetid = contact.indentDetailsId;
    this.IsClosed = contact.isClosed;
    this.IndQty = contact.qty;
    let DuplicateItem = 0;

    if (this.dsNewIssueList3.data.length > 0) {
      this.dsNewIssueList3.data.forEach((element) => {
        if (element.ItemId == contact.itemId) {
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          DuplicateItem = 1
        }
        this.Itemchargeslist1.forEach((element) => {
        })
      });
    }
    //   else  {
    debugger
    if (!DuplicateItem) {
      this.Itemchargeslist1 = [];
      this.QtyBalchk = 0;

      var m_data = {
        "ItemId": contact.itemId,
        "StoreId": this._loggedService.currentUserValue.user.storeId || 0
      }
      this._IssueToDep.getBatchList(m_data).subscribe(draftdata => {
        console.log(draftdata)
        this.Itemchargeslist1 = draftdata as any;
        console.log(this.Itemchargeslist1)
        if (this.Itemchargeslist1.length == 0) {
          Swal.fire(contact.itemId + " : " + "Item Stock is Not Avilable:")
        }
        else if (this.Itemchargeslist1.length > 0) {
          let ItemID = contact.itemId;

          let remaing_qty = contact.qty;
          let bal_qnt = 0;
          this.Itemchargeslist1.forEach((element) => {

            let IndQty = remaing_qty;
            if (IndQty > 0) {

              if (ItemID != element.itemId) {
                this.QtyBalchk = 0;
              }
              // if (this.QtyBalchk != 1) {
              if (IndQty <= element.balanceQty) {
                this.QtyBalchk = 1;
                this.getFinalCalculation(element, IndQty);
                ItemID = element.ItemId;
                bal_qnt += element.balanceQty - IndQty;
              }
              else if (IndQty > element.balanceQty) {
                this.QtyBalchk = 1;
                //Swal.fire("For Item :" + element.ItemId + " adding the Balance Qty: ", element.BalanceQty)
                this.getFinalCalculation(element, element.balanceQty);
                ItemID = element.itemId;
              }
              // }

              remaing_qty = IndQty - element.balanceQty;
            } else {
              bal_qnt += element.balanceQty;
            }
          });
          Swal.fire("Balance Qty is :", String(bal_qnt))
        }
      });
    }
  }
  Indentid: any;
  indentdetid: any;
  IsClosed: any;
  IndQty: any;
  RQty: any = 0;
  getFinalCalculation(contact, DraftQty) {

    console.log(contact)
    debugger
    this.RQty = parseInt(DraftQty);
    if (this.RQty && contact.unitMRP) {
      let TotalMRP = (parseInt(this.RQty) * (contact.unitMRP)).toFixed(2);

      let LandedRateandedTotal = (parseInt(this.RQty) * (contact.landedRate)).toFixed(2);
      let PurTotAmt = (parseInt(this.RQty) * (contact.purchaseRate)).toFixed(2);

      let v_marginamt = (parseFloat(LandedRateandedTotal) - parseFloat(LandedRateandedTotal)).toFixed(2);

      let GSTAmount = (((contact.landedRate) * (contact.vatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
      let CGSTAmt = (((contact.landedRate) * (contact.cgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      let SGSTAmt = (((contact.landedRate) * (contact.sgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      let IGSTAmt = (((contact.landedRate) * (contact.igstPer) / 100) * parseInt(this.RQty)).toFixed(2);

      let NetAmt = ((parseFloat(LandedRateandedTotal) + parseFloat(GSTAmount))).toFixed(2);

      let BQty = contact.balanceQty - this.RQty;


      if (contact.DiscPer > 0) {
        // let  DiscAmt = ((TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
        // let   NetAmt = (TotalMRP - this.DiscAmt).toFixed(2);

      }

      this.chargeslist = this.dsTempItemNameList.data;

      this.chargeslist.push(
        {
          ItemId: contact.itemId || 0,
          ItemName: contact.itemName || '',
          BatchNo: contact.batchNo,
          BatchExpDate: this.datePipe.transform(contact.batchExpDate, "yyyy-MM-dd"),
          BalanceQty: BQty || 0,
          Qty: this.RQty || 0,
          UnitRate: contact.unitMRP,
          UnitMRP: contact.unitMRP,
          TotalAmount: NetAmt || 0,
          VatPer: contact.vatPercentage || 0,
          VatAmount: GSTAmount || 0,
          TotalMRP: TotalMRP,
          DiscPer: 0,// contact.DiscPer || 0,
          DiscAmt: 0,
          NetAmt: NetAmt,
          RoundNetAmt: parseInt(NetAmt),// Math.round(TotalNet),
          StockId: contact.stockId,
          LandedRate: contact.landedRate,
          LandedRateandedTotal: LandedRateandedTotal,
          CgstPer: contact.cgstPer,
          CGSTAmt: CGSTAmt,
          SgstPer: contact.sgstPer,
          SGSTAmt: SGSTAmt,
          IgstPer: contact.igstPer,
          IGSTAmt: IGSTAmt,
          PurchaseRate: contact.purchaseRate,
          PurTotAmt: PurTotAmt,
          MarginAmt: v_marginamt,
          SalesDraftId: 1,
          IndentId: this.Indentid,
          IndentDetailsId: this.indentdetid,
          IsClosed: this.IsClosed,
          IndQty: this.IndQty

        });
      console.log(this.chargeslist);
      this.dsNewIssueList3.data = this.chargeslist
    }
  }


  getCellCalculation(contact, Qty) {

    /// this.Indbalqty = parseInt(contact.TotalIndQty) - parseInt(contact.Qty);
    debugger
    if (parseFloat(contact.Qty) > parseFloat(contact.BalanceQty)) {
      this.toastr.warning('Issue Qty cannot be greater than BalanceQty.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      contact.Qty = 0;
      contact.Qty = '';
      contact.VatAmount = 0;
      contact.LandedRateandedTotal = 0;
    }
    else {
      if (contact.Qty > 0) {
        contact.LandedRateandedTotal = (parseFloat(contact.Qty) * parseFloat(contact.LandedRate)).toFixed(2);
        contact.VatAmount = ((parseFloat(contact.VatPer) * parseFloat(contact.LandedRateandedTotal)) / 100).toFixed(2);
      }
      else {
        contact.Qty = 0;
        contact.Qty = '';
        contact.VatAmount = 0;
        contact.LandedRateandedTotal = 0;
      }
    }
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
