import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ReorderlevelsummaryService } from '../reorderlevelsummary.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-indentrequest',
  templateUrl: './indentrequest.component.html',
  styleUrls: ['./indentrequest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentrequestComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'Packing',
    'BalQty',
    'ReorderQty',
    'Action',
  ]
  dateTimeObj: any;
  sIsLoading:string ='';
  isLoadingStr: string = "";
  isLoading: String = '';
  screenFromString = 'indent-form';
  isStoreSelected:boolean=false;
  filteredOptionsStore: Observable<string[]>;
  ToStoreList:any=[];
  registerObbj:any;
  chargeslist:any=[];

  dsRaisedIndent = new MatTableDataSource<RaisedIndentList>();
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  

  constructor(
    public _Reorderlevelsummery:ReorderlevelsummaryService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<IndentrequestComponent>,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObbj = this.data.Obj;
      console.log(this.registerObbj)
      //this.dsRaisedIndent = this.registerObbj
      this.chargeslist = this.registerObbj;
      //console.log(this.chargeslist)
      this.getRaisedIndent();
    }
    this.filteredOptionsStore = this._Reorderlevelsummery.RaisedIndentFrom.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
    );

    this.getToStoreSearchList();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getToStoreSearchList() {
    this._Reorderlevelsummery.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
    });
  }
  private _filterToStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStores(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getRaisedIndent(){
    this.dsRaisedIndent = this.registerObbj
    this.dsRaisedIndent = this.chargeslist;
    this.dsRaisedIndent.sort = this.sort;
    this.dsRaisedIndent.paginator = this.paginator;
  }
  OnSave(){
    if ((!this.dsRaisedIndent.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsRaisedIndent.data = [];
      this.dsRaisedIndent = this.chargeslist;
      console.log(this.chargeslist)
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  OnReset(){
    this.dsRaisedIndent.data = [];
    this._Reorderlevelsummery.RaisedIndentFrom.reset();
    this._matDialog.closeAll();
  }
  onClose(){
    this._matDialog.closeAll(); 
  }
}
export class RaisedIndentList{

}