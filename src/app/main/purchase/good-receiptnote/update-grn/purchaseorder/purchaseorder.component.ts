import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GoodReceiptnoteService } from '../../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { UpdateGRNComponent } from '../update-grn.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PurchaseorderComponent implements OnInit {
  displayedColumns = [
    'PurchaseDate',
    'PurchaseNo',
    'SupplierName',
    'TotalAmount',
    'GrandTotal',
  ];
  displayedColumns1 = [
    'Action',
    'ItemId',
    'ItemName',
    'UOMID',
    'UnitofMeasurementName',
    'Qty',
    'MRP',
    'Rate',
    'TotalAmount',
    'VatPer',
    'VatAmount',
    'DiscPer',
    'DiscAmount',
    'LandedRate',
    'GrandTotalAmount',
    'GrossAmount',
    'POQty',
    'PurchaseId',
    'PurDetId',
    'CGSTPer',
    'SGSTPer',
    'IGSTPer'
  ];

  sIsLoading: string = '';
  isLoading = true;
  screenFromString = 'po-form';
  dateTimeObj: any;
  isSupplierSelected:boolean=false;
  SupplierList:any=[];
  filteredoptionsSupplier: Observable<string[]>;
  optionsSupplier: any;
  StoreList:any=[];

  dsPOList = new MatTableDataSource<POList>();
  dsPODetailList = new MatTableDataSource<PODetailList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<PurchaseorderComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSupplierSearchCombo();
    this.gePharStoreList();
    this.getDirectPOList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }
  getSupplierSearchCombo() {
    var vdata={
      'SupplierName':`${this._GRNList.POFrom.get('SupplierId').value}%`,
    }
    this._GRNList.getSupplierSearchList(vdata).subscribe(data => {
      this.SupplierList = data;
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNList.POFrom.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
    });
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  } 
  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNList.POFrom.get('StoreId').setValue(this.StoreList[0]);

    });
  }
  getDirectPOList(){
      var Param = {
        "ToStoreId": this.accountService.currentUserValue.user.storeId,// this._GRNService.GRNSearchGroup.get('ToStoreId').value.storeid,
        "From_Dt": this.datePipe.transform(this._GRNList.POFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "To_Dt": this.datePipe.transform(this._GRNList.POFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "Status": this._GRNList.POFrom.get("Status").value || 0,
        "SupplierId": this._GRNList.POFrom.get('SupplierId').value.SupplierId || 0,
      }
      this._GRNList.getDirectPOList(Param).subscribe(data => {
        this.dsPOList.data = data as POList[];
        this.dsPOList.sort = this.sort;
        this.dsPOList.paginator = this.paginator;
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
  }
  getPOList(Params){
      var data1 = {
        "PurchaseID": Params.PurchaseID
      }
      this._GRNList.getPurchaseItemList(data1).subscribe(data => {
        this.dsPODetailList.data = data as PODetailList[];
        
        this.dsPODetailList.sort = this.sort;
        this.dsPODetailList.paginator = this.paginator;
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
   
  }
  interimArray: any = [];
  tableElementChecked(event, element) {
    if (event.checked) {
      this.interimArray.push(element);
    }
  }

  OnAddgrn( ) { 
    if ((!this.dsPODetailList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this._dialogRef.close(this.interimArray);
  }
  onClose() {
    this._dialogRef.close();
  }
  onClear(){
    
  }
} 
export class PODetailList{
  PurchaseId: any;
  ItemName: string;
  Qty: number;
  Rate: number;
  DiscPer: number;
  DiscAmount: number;
  VatPer: number;
  VatAmount: number;
  TotalAmount: number;
  MRP: number;
  GrandTotalAmount: number;

  constructor(PODetailList){
    this.PurchaseId = PODetailList.PurchaseId || 0;
      this.ItemName = PODetailList.ItemName || "";
      this.Qty = PODetailList.Qty || 0;
      this.Rate = PODetailList.Rate || 0;
      this.DiscPer = PODetailList.DiscPer || 0;
      this.DiscAmount = PODetailList.DiscAmount || 0;
      this.VatPer = PODetailList.VatPer || 0;
      this.VatAmount = PODetailList.VatAmount || 0;
      this.TotalAmount = PODetailList.TotalAmount || 0;
      this.MRP = PODetailList.MRP || 0;
      this.GrandTotalAmount = PODetailList.GrandTotalAmount || 0;
  }
}
export class POList {
  PurchaseDate: any;
  SupplierName: string;
  PurchaseNo: number;
  TotalAmount: number;
  GrandTotal: number;
  /**
   * Constructor
   *
   * @param POList
   */
  constructor(POList) {
    {

      this.PurchaseDate = POList.PurchaseDate || 0;
      this.SupplierName = POList.SupplierName || "";
      this.PurchaseNo = POList.PurchaseNo || 0;
      this.TotalAmount = POList.TotalAmount || 0;
      this.GrandTotal = POList.GrandTotal || 0;
    }
  }
}
