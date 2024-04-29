import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GrnReturnService } from '../../grn-return.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GrnListComponent implements OnInit {
  displayedColumns2 = [
    'Action',
    "GRNNO",
    "GRNDate",
    "SupplierName",
    'TotalAmount',
    'GrandTotal',
  ];
  dateTimeObj:any;
  SupplierList:any=[];
  isSupplierSelected:boolean=false;
  filteredoptionsSupplier: Observable<string[]>;
  optionsSupplier:any;
  sIsLoading: string;
  Onsave:boolean = true;

  dsGRNList = new MatTableDataSource<GRNList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  constructor(
    public _GRNReturnHeaderList: GrnReturnService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public _dialogRef: MatDialogRef<GrnListComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSupplierSearchCombo();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSupplierSearchCombo() {
    var vdata={
      'SupplierName':`${this._GRNReturnHeaderList.GRNListFrom.get('SupplierId').value}%`,
    }
    this._GRNReturnHeaderList.getSupplierSearchList(vdata).subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
       this.optionsSupplier = this.SupplierList.slice();
       this.filteredoptionsSupplier = this._GRNReturnHeaderList.GRNListFrom.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
    });
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }  
  getGRNList(){
    this.sIsLoading = 'loading-data';
    var Param = {
      "SupplierId": this._GRNReturnHeaderList.GRNListFrom.get('SupplierId').value.SupplierId || 0,
      "From_Dt": this.datePipe.transform(this._GRNReturnHeaderList.GRNListFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNReturnHeaderList.GRNListFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "StoreId":this._loggedService.currentUserValue.user.storeId || 0,
    }
   // console.log(Param);
    this._GRNReturnHeaderList.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data as GRNList[];
    //  console.log(this.dsGRNList);
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  SelectedArray: any = [];
  tableElementChecked(event, element) {
    if (event.checked) {
      this.SelectedArray.push(element);
    }
    console.log(this.SelectedArray)
    this.Onsave=false;
  }
  onClear(){
    this._GRNReturnHeaderList.GRNListFrom.reset();
  }
  onClose(){
    this._matDialog.closeAll();
  }
  OnReset(){
   // this._GRNReturnHeaderList.GRNListFrom.reset();
    this.dsGRNList.data = []; 
    this.onClose();
  }
  OnselectGRNList(){
    if ((!this.dsGRNList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
    this._dialogRef.close(this.SelectedArray);
    this._GRNReturnHeaderList.GRNListFrom.get("start").setValue((new Date()).toISOString())
    this._GRNReturnHeaderList.GRNListFrom.get("start").setValue((new Date()).toISOString())
  }
}
export class GRNList{
  GRNNO:any;
  GRNDate:number;
  SupplierName:string;
  TotalAmount:number;
  GrandTotal:number;

  constructor(GRNList){
    {
      this.GRNNO = GRNList.GRNNO || 0;
      this.GRNDate = GRNList.GRNDate || 0;
      this.SupplierName = GRNList.SupplierName || '';
      this.TotalAmount = GRNList.TotalAmount || 0;
      this.GrandTotal = GRNList.GrandTotal || 0;
    }
  }
}
