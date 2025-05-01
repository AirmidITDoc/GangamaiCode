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

@Component({
  selector: 'app-issue-to-deparment-against-indent',
  templateUrl: './issue-to-deparment-against-indent.component.html',
  styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
  NewIssueGroup:FormGroup;
  IssueFinalForm:FormGroup;
  StoreFrom:FormGroup;
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
 
  Charglist:any=[];
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
   this.NewIssueGroup=this._IssueToDep.getNewIssueForm();
   this.IssueFinalForm=this._IssueToDep.createfinal()
   this.StoreFrom=this._IssueToDep.CreateStoreFrom();
  }
  
 
  // getIndentList() {
  //   this.sIsLoading = 'loading-data';
  //   var vdata = {
  //     "ToStoreId": this._IssueToDep.IndentFrom.get('ToStoreId').value.StoreId || 0,
  //     "From_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //     "To_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //     "Status": this._IssueToDep.IndentFrom.get('Status').value
  //   }
  //  // console.log(vdata);
  //   this._IssueToDep.getIndentList(vdata).subscribe(data => {
  //     this.dsIndentList.data = data as IndentList[];
  //     this.dsIndentList.sort = this.sort;
  //     this.dsIndentList.paginator = this.paginator;
  //     this.sIsLoading = '';
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }
  // getIndentItemDetList(Param) {
  //   this.sIsLoading = 'loading-data';
  //   var vdata = {
  //     'IndentId':Param.IndentId  
  //   }
  //   this._IssueToDep.getIndentItemDetList(vdata).subscribe(data => {
  //     this.dsIndentItemDetList.data = data as IndentItemDetList[];
  //    // console.log(this.dsIndentItemDetList.data)
  //    // this.Charglist = this.dsIndentItemDetList.data;
  //     this.dsIndentItemDetList.sort = this.sort;
  //     this.dsIndentItemDetList.paginator = this.paginator;
  //    // console.log(this.vIndentId)
  //     this.sIsLoading = '';
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  //     this.GetIndentGainstlist(Param);  
  // }
 
  // GetIndentGainstlist(param){
  //   var vdata = {
  //     'IndentId':  param.IndentId 
  // }
  //     console.log(vdata);
  //    this._IssueToDep.getAgainstIndentList(vdata).subscribe(data => {
  //     this.dstempdata.data = data as IndentItemDetList[];
  //     this.Charglist = this.dstempdata.data;
  //     console.log(this.Charglist);
  //     console.log( this.dstempdata.data);
  // });
  // }
  // OnIndentList(){
  //   if ((!this.dsIndentItemDetList.data.length)) {
  //     this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }    
  //   console.log(this.Charglist)
  //   this._dialogRef.close(this.Charglist);
  // }


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
    //     // const isDuplicate = this.dsNewIssueList3.data.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId);
    //     // if (!isDuplicate) {
    //     let gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));

    //     this.chargeslist = this.dsTempItemNameList.data;
    //     // if (this.dsNewIssueList3.data.length > 0) {
    //     //   this.chargeslist = this.dsNewIssueList3.data;
    //     // } 
    //     let TotalMRP = this.vUnitMRP * this.vQty
    //     let PurTotAmt = this.vPurchaseRate * this.vQty

    //     let LandedRateandedTotal = this.vLandedRate * this.vQty

    //     let GSTAmount = (((this.vUnitMRP) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(2);
    //     // let  CGSTAmt = (((contact.LandedRate) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    //     // let  SGSTAmt = (((contact.LandedRate) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
    //     // let  IGSTAmt = (((contact.LandedRate) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2); 


    //     this.chargeslist.push(
    //         {
    //             ItemId: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId || 0,
    //             ItemName: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemName || '',
    //             BatchNo: this.vBatchNo,
    //             BatchExpDate: this.vBatchExpDate || '01/01/1900',
    //             BalanceQty: this.vBalanceQty || 0,
    //             Qty: this.vQty || 0,
    //             LandedRate: this.vLandedRate || 0,
    //             UnitMRP: this.vUnitMRP || 0,
    //             VatPer: gstper || 0,
    //             VatAmount: (((this.vTotalAmount) * (gstper)) / 100).toFixed(2),
    //             TotalAmount: this.vTotalAmount || 0,
    //             StockId: this.vStockId,

    //             TotalMRP: TotalMRP,
    //             DiscPer: 0,// contact.DiscPer || 0,
    //             DiscAmt: 0,
    //             NetAmt: LandedRateandedTotal,
    //             RoundNetAmt: Math.round(LandedRateandedTotal),// Math.round(TotalNet),
    //             mrpTotalAmount: TotalMRP,

    //             //LandedRate: this.vLandedRate,
    //             LandedRateandedTotal: LandedRateandedTotal,
    //             CgstPer: this.vCgstPer,
    //             //   CGSTAmt: CGSTAmt,
    //             SgstPer: this.vSgstPer,
    //             //   SGSTAmt: SGSTAmt,
    //             IgstPer: this.vIgstPer,
    //             //   IGSTAmt: IGSTAmt,
    //             PurchaseRate: this.vPurchaseRate,
    //             PurTotAmt: PurTotAmt,
    //             purTotalAmount: PurTotAmt,
    //             //   MarginAmt: v_marginamt,
    //             SalesDraftId: 1
    //         });
    //     console.log(this.chargeslist);
    //     this.dsNewIssueList3.data = this.chargeslist

    // }

    // this.ItemReset();
    // this.itemid.nativeElement.focus();
    // this._IssueToDep.NewIssueGroup.get('ItemID').setValue('');
    // this.Addflag = false;

    // if (!(this._IssueToDep.NewIssueGroup.invalid) && this.dsNewIssueList3.data.length > 0) {
    //     this.vsaveflag = false;
    // }
}


  CalculateTotalAmt() {
    if (this.vQty > this.vBalanceQty) {
        this.toastr.warning('Enter Qty less than Balance', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        this._IssueToDep.NewIssueGroup.get('Qty').setValue(0);
    }
    if (this.vQty && this.vLandedRate) {
        this.vTotalAmount = (parseFloat(this.vQty) * parseFloat(this.vLandedRate)).toFixed(2);
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
ItemID=0;
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
    // const currentDate = new Date();
    // const datePipe = new DatePipe('en-US');
    // const formattedTime = datePipe.transform(currentDate, 'shortTime');
    // const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    // this.vsaveflag = true;
    // if ((!this.dsNewIssueList3.data.length)) {
    //     this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    // if ((this.vTostoreId == '' || this.vTostoreId == null || this.vTostoreId == undefined)) {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }

    // const isChecked = this.ToStoreList.some(item => item.StoreName === this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreName);
    // if (isChecked) {
    //     this.savebtn = true;
    //     let insertheaderObj = {};
    //     insertheaderObj['issueDate'] = formattedDate;
    //     insertheaderObj['issueTime'] = formattedTime;
    //     insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
    //     insertheaderObj['toStoreId'] = this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
    //     insertheaderObj['totalAmount'] = this._IssueToDep.IssueFinalForm.get('FinalTotalAmount').value || 0;
    //     insertheaderObj['totalVatAmount'] = this._IssueToDep.IssueFinalForm.get('GSTAmount').value || 0;
    //     insertheaderObj['netAmount'] = this._IssueToDep.IssueFinalForm.get('FinalNetAmount').value || 0;
    //     insertheaderObj['remark'] = this._IssueToDep.IssueFinalForm.get('Remark').value || '';
    //     insertheaderObj['addedby'] = this._loggedService.currentUserValue.user.id || 0;
    //     insertheaderObj['isVerified'] = false;
    //     insertheaderObj['isclosed'] = false;
    //     insertheaderObj['indentId'] = 0;
    //     insertheaderObj['issueId'] = 0;

    //     let isertItemdetailsObj = [];
    //     this.dsNewIssueList3.data.forEach(element => {
    //         console.log(element)

    //         let insertitemdetail = {};
    //         insertitemdetail['issueId'] = 0;
    //         insertitemdetail['itemId'] = element.ItemId;
    //         insertitemdetail['batchNo'] = element.BatchNo;
    //         insertitemdetail['batchExpDate'] = element.BatchExpDate;
    //         insertitemdetail['issueQty'] = element.Qty;
    //         insertitemdetail['perUnitLandedRate'] = element.LandedRate;
    //         insertitemdetail['LandedTotalAmount'] = element.LandedRateandedTotal;
    //         insertitemdetail['unitMRP'] = element.UnitMRP;
    //         insertitemdetail['mrpTotalAmount'] = element.TotalMRP;
    //         insertitemdetail['unitPurRate'] = element.PurchaseRate;
    //         insertitemdetail['purTotalAmount'] = element.PurTotAmt;
    //         insertitemdetail['vatPercentage'] = element.VatPer || 0;
    //         insertitemdetail['vatAmount'] = element.VatAmount || 0;
    //         insertitemdetail['stkId'] = element.StockId;
    //         isertItemdetailsObj.push(insertitemdetail);
    //     });
    //     let updateissuetoDepartmentStock = [];
    //     this.dsNewIssueList3.data.forEach(element => {
    //         let updateitemdetail = {};
    //         updateitemdetail['itemId'] = element.ItemId;
    //         updateitemdetail['issueQty'] = element.Qty;
    //         updateitemdetail['stkId'] = element.StockId;
    //         updateitemdetail['storeID'] = this._loggedService.currentUserValue.user.storeId;
    //         updateissuetoDepartmentStock.push(updateitemdetail);
    //     });

    //     let submitData = {
    //         "insertIssuetoDepartmentHeader": insertheaderObj,
    //         "insertIssuetoDepartmentDetail": isertItemdetailsObj,
    //         "updateissuetoDepartmentStock": updateissuetoDepartmentStock
    //     };

    //     console.log(submitData);

    //     this._IssueToDep.IssuetodepSave(submitData).subscribe(response => {
    //         if (response) {
    //             this.toastr.success('Record New Issue To Department Saved Successfully.', 'Saved !', {
    //                 toastClass: 'tostr-tost custom-toast-success',
    //             });
    //             this.viewgetIssuetodeptReportPdf(response, this.vprintflag);
    //             this.OnReset();
    //             this.getIssueToDep();
    //             this.savebtn = false;
    //         } else {
    //             this.toastr.error('New Issue To Department Data not saved !, Please check validation error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         }
    //     }, error => {
    //         this.toastr.error('New Issue To Department Data not saved !, Please check API error..', 'Error !', {
    //             toastClass: 'tostr-tost custom-toast-error',
    //         });
    //     });
    // } else {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
}
OnSaveAgaintIndent() {
    // const currentDate = new Date();
    // const datePipe = new DatePipe('en-US');
    // const formattedTime = datePipe.transform(currentDate, 'shortTime');
    // const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    // this.vsaveflag = true;
    // if ((!this.dsNewIssueList3.data.length)) {
    //     this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    // if ((this.vTostoreId == '' || this.vTostoreId == null || this.vTostoreId == undefined)) {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    // const isChecked = this.ToStoreList.some(item => item.StoreName === this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreName);
    // if (isChecked) {
    //     this.savebtn = true;
    //     let insertheaderObj = {};
    //     insertheaderObj['issueDate'] = formattedDate;
    //     insertheaderObj['issueTime'] = formattedTime;
    //     insertheaderObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
    //     insertheaderObj['toStoreId'] = this._IssueToDep.NewIssueGroup.get('ToStoreId').value.StoreId || 0;
    //     insertheaderObj['totalAmount'] = this._IssueToDep.IssueFinalForm.get('FinalTotalAmount').value || 0;
    //     insertheaderObj['totalVatAmount'] = this._IssueToDep.IssueFinalForm.get('GSTAmount').value || 0;
    //     insertheaderObj['netAmount'] = this._IssueToDep.IssueFinalForm.get('FinalNetAmount').value || 0;
    //     insertheaderObj['remark'] = this._IssueToDep.IssueFinalForm.get('Remark').value || '';
    //     insertheaderObj['addedby'] = this._loggedService.currentUserValue.user.id || 0;
    //     insertheaderObj['isVerified'] = false;
    //     insertheaderObj['isclosed'] = false;
    //     insertheaderObj['indentId'] = this.vIndentId;
    //     insertheaderObj['issueId'] = 0;

    //     let isertItemdetailsObj = [];
    //     this.dsNewIssueList3.data.forEach(element => {
    //         console.log(element)

    //         let insertitemdetail = {};
    //         insertitemdetail['issueId'] = 0;
    //         insertitemdetail['itemId'] = element.ItemId;
    //         insertitemdetail['batchNo'] = element.BatchNo;
    //         insertitemdetail['batchExpDate'] = element.BatchExpDate;
    //         insertitemdetail['issueQty'] = element.Qty;
    //         insertitemdetail['perUnitLandedRate'] = element.LandedRate;
    //         insertitemdetail['LandedTotalAmount'] = element.LandedRateandedTotal;
    //         insertitemdetail['unitMRP'] = element.UnitMRP;
    //         insertitemdetail['mrpTotalAmount'] = element.TotalMRP;
    //         insertitemdetail['unitPurRate'] = element.PurchaseRate;
    //         insertitemdetail['purTotalAmount'] = element.PurTotAmt;
    //         insertitemdetail['vatPercentage'] = element.VatPer || 0;
    //         insertitemdetail['vatAmount'] = element.VatAmount || 0;
    //         insertitemdetail['stkId'] = element.StockId;
    //         isertItemdetailsObj.push(insertitemdetail);
    //     });

    //     let updateissuetoDepartmentStock = [];
    //     this.dsNewIssueList3.data.forEach(element => {

    //         let updateitemdetail = {};
    //         updateitemdetail['itemId'] = element.ItemId;
    //         updateitemdetail['issueQty'] = element.Qty;
    //         updateitemdetail['stkId'] = element.StockId;
    //         updateitemdetail['storeID'] = this._loggedService.currentUserValue.user.storeId;
    //         updateissuetoDepartmentStock.push(updateitemdetail);
    //     });

    //     let update_IndentHeader_StatusObj = {};
    //     update_IndentHeader_StatusObj['indentId'] = this.vIndentId;
    //     update_IndentHeader_StatusObj['isClosed'] = this.Isclosedchk;


    //     let updateIndentStatusIndentDetails = [];
    //     this.dsNewIssueList3.data.forEach(element => {
    //         debugger
    //         let balQty = (parseInt(element.IndQty) - parseInt(element.Qty))
    //         if (balQty == 0) {
    //             this.Isclosedchk = false;
    //         } else {
    //             this.Isclosedchk = true;
    //         }
    //         let updateIndentStatusIndentDetailsObj = {};
    //         updateIndentStatusIndentDetailsObj['indentId'] = element.IndentId;
    //         updateIndentStatusIndentDetailsObj['indDetID'] = element.IndentDetailsId;
    //         updateIndentStatusIndentDetailsObj['isClosed'] = this.Isclosedchk;
    //         updateIndentStatusIndentDetailsObj['indQty'] = balQty;
    //         updateIndentStatusIndentDetails.push(updateIndentStatusIndentDetailsObj);
    //     });

    //     let submitData = {
    //         "insertIssuetoDepartmentHeader1": insertheaderObj,
    //         "insertIssuetoDepartmentDetail1": isertItemdetailsObj,
    //         "updateissuetoDepartmentStock1": updateissuetoDepartmentStock,
    //         "update_IndentHeader_Status": update_IndentHeader_StatusObj,
    //         "updateIndentStatusIndentDetails": updateIndentStatusIndentDetails
    //     };

    //     console.log(submitData);

    //     this._IssueToDep.IssuetodepAgaintIndetSave(submitData).subscribe(response => {
    //         if (response) {
    //             this.toastr.success('Record New Issue To Department Againt Indent Saved Successfully.', 'Saved !', {
    //                 toastClass: 'tostr-tost custom-toast-success',
    //             });
    //             this.viewgetIssuetodeptReportPdf(response, this.vprintflag);
    //             this.OnReset();
    //             this.getIssueToDep();
    //             this.savebtn = false;
    //             this.vIndentId = 0;
    //         } else {
    //             this.toastr.error('New Issue To Department Againt Indent Data not saved !, Please check validation error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         }
    //     }, error => {
    //         this.toastr.error('New Issue To Department Againt Indent Data not saved !, Please check API error..', 'Error !', {
    //             toastClass: 'tostr-tost custom-toast-error',
    //         });
    //     });
    // } else {
    //     this.toastr.warning('Please select TostoreId', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
}
  onClose() {
    this._matDialog.closeAll();
  }
  OnReset(){
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
  IndentId:any;
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
  IndentId:any;
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
