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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<PurchaseorderComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSupplierSearchCombo();
    this.gePharStoreList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }
  getSupplierSearchCombo() {

    this._GRNList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNList.GRNSearchGroup.get('SupplierId').valueChanges.pipe(
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
      console.log(Param);
      this._GRNList.getDirectPOList(Param).subscribe(data => {
        this.dsPOList.data = data as POList[];
        this.dsPOList.sort = this.sort;
        this.dsPOList.paginator = this.paginator;
        console.log(this.dsPOList);
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
  }
  onClear(){

  }
  onClose() {
    this._dialogRef.close();
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
