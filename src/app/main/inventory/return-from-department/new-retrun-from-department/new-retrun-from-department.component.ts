import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ReturnFromDepartmentService } from '../return-from-department.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { E } from '@angular/cdk/keycodes';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-retrun-from-department',
  templateUrl: './new-retrun-from-department.component.html',
  styleUrls: ['./new-retrun-from-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewRetrunFromDepartmentComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'IssueQty',
    'LandedTotalAmount',
    'Action'
  ];
  displayedColumns1 = [
    'IssueDate',
    'IssueId',
    'IssueNo',
    'Action'
  ];
  displayedColumns2 = [
   // 'IssueId',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'IssueQty',
    'ReturnQty',
    'PerUnitLandedRate',
    'LandedTotalAmount',
    'UnitPurRate',
    'PurTotalAmount',
    'UnitMRP',
    'MRPTotalAmount',
    'VatPercentage',
    'VatAmount',
    'StkId',
    'Action'
  ];
  dateTimeObj: any;
  StoreList: any;
  ToStoreList: any;
  isStoreSelected: boolean = false;
  filteredOptionsStore: Observable<string[]>;
  screenFromString = 'admission-from';
  sIsLoading: string = '';
  isLoading = true;
  vMRPTotalAmount: any = 0;
  vTotalvatAmount:any=0;
  vPurTotalAmount:any=0;
  vLandedTotalAmount:any=0;
  vIssueId: any = 0;
  vStockId: any = 0;
  vmrpTotalAmount: any = 0;
  vpurchaseTotalAmount: any = 0;
  vtotalVATAmount: any = 0;
  vRemark: any = ''
  Savebtn: boolean = false;
  SpinLoading: boolean = false;

  dsItemList = new MatTableDataSource<ItemList>();
  dsIssueList = new MatTableDataSource<IssueList>();
  dsItemDetailsList = new MatTableDataSource<ItemList>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', { static: true }) public thirdPaginator: MatPaginator;
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRetrunFromDepartmentComponent>,
    private accountService: AuthenticationService,
    public _loggedService: AuthenticationService,
    public toastr: ToastrService,
    public _ReturnToDepartmentList: ReturnFromDepartmentService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getToStoreSearchList();

    this.filteredOptionsStore = this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
    );
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._ReturnToDepartmentList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._ReturnToDepartmentList.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getToStoreSearchList() {
    this._ReturnToDepartmentList.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
    });
  }
  private _filterToStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStoresList(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  getNewReturnToDepartmentList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "FromStoreId": this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').value.StoreId || 0,
      "ToStoreId":  this._loggedService.currentUserValue.user.storeId || 0,
      "FromDate": this.datePipe.transform(this._ReturnToDepartmentList.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._ReturnToDepartmentList.userFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    this._ReturnToDepartmentList.getNewReturnToDepartmentList(vdata).subscribe(data => {
      this.dsIssueList.data = data as IssueList[];
      this.dsIssueList.sort = this.sort;
      this.dsIssueList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getItemList(param) {
    this.vIssueId = param.IssueId
    var vdata = {
      "IssueId": param.IssueId
    }
    this._ReturnToDepartmentList.getNewReturnItemList(vdata).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  chargeslist: any = [];
  getItemdetails(param) {
    this.chargeslist.push(
      {
        ItemId: param.ItemId || 0,
        ItemName: param.ItemName || '',
        BatchExpDate: param.BatchExpDate || 0,
        IssueQty: param.IssueQty || 0,
        ReturnQty:'',
        PerUnitLandedRate: param.PerUnitLandedRate || 0,
        VatPercentage: param.VatPercentage || 0,
        LandedTotalAmount: param.LandedTotalAmount || 0,
        StkId: param.StkId || 0,
        IssueDepId: param.IssueDepId || 0,
        IssueId: param.IssueId || 0,
        BatchNo: param.BatchNo || 0,
        VatAmount: param.VatAmount || 0,
        UnitMRP: param.UnitMRP || 0,
        MRPTotalAmount: param.MRPTotalAmount || 0,
        UnitPurRate: param.UnitPurRate || 0,
        PurTotalAmount: param.PurTotalAmount || 0,
        IsBatchRequired: param.IsBatchRequired || 0,

      });
    this.sIsLoading = '';
    this.dsItemDetailsList.data = this.chargeslist;
  }

  getTotalamt(element) {
    this.vLandedTotalAmount = (element.reduce((sum, { LandedTotalAmount }) => sum += +(LandedTotalAmount || 0), 0)).toFixed(2);
    this.vTotalvatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vMRPTotalAmount = (element.reduce((sum, { MRPTotalAmount }) => sum += +(MRPTotalAmount || 0), 0)).toFixed(2);
    this.vPurTotalAmount = (element.reduce((sum, { PurTotalAmount }) => sum += +(PurTotalAmount || 0), 0)).toFixed(2);

    return this.vLandedTotalAmount;
  }
  Celldatacalculation(contact,RetrunQty){
    if(contact.ReturnQty > contact.IssueQty){
      this.toastr.warning('Return Qty cannot be greater than IssueQty.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      contact.ReturnQty = 0;
      contact.ReturnQty = '';
      contact.LandedTotalAmount = 0;
      contact.MRPTotalAmount = 0;
      contact.PurTotalAmount = 0;
      contact.VatAmount = 0;
    }
    else{
    if(contact.ReturnQty > 0){
        contact.LandedTotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.PerUnitLandedRate)).toFixed(2);
        contact.MRPTotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.UnitMRP)).toFixed(2);
        contact.PurTotalAmount = (parseFloat(contact.ReturnQty) * parseFloat(contact.UnitPurRate)).toFixed(2);
        contact.VatAmount = ((parseFloat(contact.VatPercentage) * parseFloat(contact.MRPTotalAmount)) / 100).toFixed(2);
      }
    else{
      contact.ReturnQty = 0;
      contact.LandedTotalAmount = 0;
      contact.MRPTotalAmount = 0;
      contact.PurTotalAmount = 0;
      contact.VatAmount = 0;
    }
  }
  }
  OnSave() {
    if ((!this.dsIssueList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.dsItemDetailsList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').value == '')) {
      this.toastr.warning('Plz Select Return  To Store Value.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isCheckReturnQty = this.dsItemDetailsList.data.some(item => item.ReturnQty === this._ReturnToDepartmentList.userFormGroup.get('ReturnQty').value);
    if(!isCheckReturnQty){
    this.Savebtn = true;
    let insertReturnDepartmentHeader = {};
    insertReturnDepartmentHeader['returnDate'] = this.dateTimeObj.date;
    insertReturnDepartmentHeader['returnTime'] = this.dateTimeObj.time;
    insertReturnDepartmentHeader['fromStoreId'] = this._loggedService.currentUserValue.user.storeId
    insertReturnDepartmentHeader['toStoreId'] = this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').value.StoreId || 0;
    insertReturnDepartmentHeader['landedRateTotalAmount'] = this.vLandedTotalAmount || 0;
    insertReturnDepartmentHeader['mrpTotalAmount'] = this.vMRPTotalAmount || 0;
    insertReturnDepartmentHeader['purchaseTotalAmount'] = this.vPurTotalAmount || 0;
    insertReturnDepartmentHeader['totalVATAmount'] = this.vTotalvatAmount || 0;
    insertReturnDepartmentHeader['addedby'] = this.accountService.currentUserValue.user.id || 0;
    insertReturnDepartmentHeader['remark'] = this._ReturnToDepartmentList.NewReturnFinalForm.get('Remark').value || '';
    insertReturnDepartmentHeader['returnId'] = 0;

    let insertReturnDepartmentDetailarray = [];
    this.dsItemDetailsList.data.forEach(element => {
      let remainingQty = element.IssueQty - element.ReturnQty
      let insertReturnDepartmentDetail = {};
      insertReturnDepartmentDetail['returnId'] = 0;
      insertReturnDepartmentDetail['issueId'] = element.IssueId;
      insertReturnDepartmentDetail['itemId'] = element.ItemId;
      insertReturnDepartmentDetail['batchNo'] = this._loggedService.currentUserValue.user.storeId;
      insertReturnDepartmentDetail['batchExpDate'] = element.BatchExpDate;
      insertReturnDepartmentDetail['balQty'] =element.IssueQty || 0
      insertReturnDepartmentDetail['returnQty'] = element.ReturnQty || 0;
      insertReturnDepartmentDetail['remainingQty'] = remainingQty || 0;
      insertReturnDepartmentDetail['unitLandedRate'] = element.PerUnitLandedRate || 0;
      insertReturnDepartmentDetail['totalLandedRate'] = element.LandedTotalAmount || 0;
      insertReturnDepartmentDetail['unitPurchaseRate'] = element.UnitPurRate || 0;
      insertReturnDepartmentDetail['totalPurAmount'] = element.PurTotalAmount || 0;
      insertReturnDepartmentDetail['unitMRP'] = element.UnitMRP || 0;
      insertReturnDepartmentDetail['totalMRPAmount'] =element.MRPTotalAmount || 0;
      insertReturnDepartmentDetail['vatPer'] = element.VatPercentage || 0;
      insertReturnDepartmentDetail['vatAmount'] = element.VatAmount || 0;
      insertReturnDepartmentDetail['remark'] = this._ReturnToDepartmentList.NewReturnFinalForm.get('Remark').value || '';
      insertReturnDepartmentDetailarray.push(insertReturnDepartmentDetail);
    });

    let submitData = {
      "insertReturnDepartmentHeader": insertReturnDepartmentHeader,
      "insertReturnDepartmentDetail": insertReturnDepartmentDetailarray
    };

    console.log(submitData);
    this._ReturnToDepartmentList.ReturnfromdeptSave(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record New Return From Department Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.viewgetReturnfromdeptReportPdf(response);
        this.OnReset();
        this.onClose();
        this.Savebtn = false;
      } else {
        this.toastr.error('New Return from Department Data not saved !, Please check validation error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Return From Department Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  else{
    this.toastr.warning('Please enter ReturnQty.Without ReturnQty Cannot perform save operation.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-error',
    }); 
  }
  }

  deleteTableRow(element) {
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dsItemDetailsList.data = [];
        this.dsItemDetailsList.data = this.chargeslist;
      }
    }

  viewgetReturnfromdeptReportPdf(ReturnId) {
    this.sIsLoading == 'loading-data'

    setTimeout(() => {
      this.SpinLoading = true;
      // FromDate,ToDate,FromStoreId ,ToStoreId
      this._ReturnToDepartmentList.getReturnfromDeptview(ReturnId).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Return From Dept Reprt Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });
    }, 1000);
  }

  OnReset() {
    this.dsIssueList.data = [];
    this.dsItemDetailsList.data = [];
    this.dsItemList.data = [];
    this.chargeslist.data =[];
   this._ReturnToDepartmentList.NewReturnFinalForm.reset();
    this._ReturnToDepartmentList.userFormGroup.reset()
  }
  onClose() {
    this._matDialog.closeAll();
  }
}
export class ItemList {
  ItemId: any;
  ItemName: string;
  BatchNo: any;
  BatchExpDate: number;
  Qty: number;
  unitLandedRate: number;
  unitPurchaseRate: any;
  LandedTotalAmount: number;
  PurTotalAmount: any;
  VatPer: number;
  VatAmount: number;
  StoreId: any;
  StoreName: any;
  UnitMRP: any;
  MRPTotalAmount: any;
  BalQty: any;
  ReturnQty: any;
  RemainingQty: any;
  Remark: any;
  VatPercentage: any;
  IssueQty: any;
  UnitPurRate: any;
  PerUnitLandedRate: any;
  position: any;
  StkId:any;
  IssueId:any;

  constructor(ItemList) {
    {
      this.ItemId = ItemList.ItemId || 0;
      this.StkId = ItemList.StkId || 0;
      this.IssueId = ItemList.IssueId || 0;
      this.ItemName = ItemList.ItemName || "";
      this.BatchNo = ItemList.BatchNo || 0;
      this.BatchExpDate = ItemList.BatchExpDate || 0;
      this.Qty = ItemList.Qty || 0;
      this.Qty = ItemList.Qty || 0;
      this.IssueQty = ItemList.IssueQty || 0;
      this.unitPurchaseRate = ItemList.unitPurchaseRate || 0;
      this.VatPercentage = ItemList.VatPercentage || 0;
      this.LandedTotalAmount = ItemList.LandedTotalAmount || 0;
      this.PurTotalAmount = ItemList.PurTotalAmount || 0;
      this.VatPer = ItemList.VatPer || 0;
      this.VatAmount = ItemList.VatAmount || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || "";
      this.UnitMRP = ItemList.UnitMRP || 0;
      this.MRPTotalAmount = ItemList.MRPTotalAmount || 0;
      this.BalQty = ItemList.BalQty || 0;
      this.ReturnQty = ItemList.ReturnQty || 0;
      this.RemainingQty = ItemList.RemainingQty || 0;
      this.Remark = ItemList.Remark || "";
      this.UnitPurRate = ItemList.UnitPurRate || 0;
      this.PerUnitLandedRate = ItemList.PerUnitLandedRate || 0;
      // this.Remark = ItemList.Remark || "";
    }
  }
}











export class IssueList {
  IssueDate: any;
  IssueId: any;
  IssueNo: any;
  constructor(IssueList) {
    {
      this.IssueDate = IssueList.IssueDate || 0;
      this.IssueId = IssueList.IssueId || 0;
      this.IssueNo = IssueList.IssueNo || 0;

    }
  }
}
export class ItemDetailsList {
  ItemId: any;
  ItemName: string;
  BatchExpDate: any;
  IssueQty: number;
  PerUnitLandedRate: number;
  VatPercentage: number;
  LandedTotalAmount: number;
  StkId: any;
  constructor(ItemDetailsList) {
    {
      this.ItemId = ItemDetailsList.ItemId || 0,
        this.ItemName = ItemDetailsList.ItemName || '',
        this.BatchExpDate = ItemDetailsList.BatchExpDate || 0,
        this.IssueQty = ItemDetailsList.PerUnitLandedRate || 0,
        this.PerUnitLandedRate = ItemDetailsList.PerUnitLandedRate || 0,
        this.VatPercentage = ItemDetailsList.VatPercentage || 0,
        this.LandedTotalAmount = ItemDetailsList.LandedTotalAmount || 0,
        this.StkId = ItemDetailsList.StkId || 0
    }
  }

}
