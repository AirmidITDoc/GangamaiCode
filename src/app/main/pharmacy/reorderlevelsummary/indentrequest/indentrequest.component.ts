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
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

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
    'StripQty',
    'IndentQty',
    'Action',
  ]
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoadingStr: string = "";
  isLoading: String = '';
  screenFromString = 'indent-form';
  isStoreSelected: boolean = false;
  filteredOptionsStore: Observable<string[]>;
  ToStoreList: any = [];
  registerObbj: any;
  chargeslist: any = [];
  vToStored: any;
  Savebtn:boolean=false
  dsRaisedIndent = new MatTableDataSource<RaisedIndentList>();
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    
    public _Reorderlevelsummery: ReorderlevelsummaryService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<IndentrequestComponent>,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService
  ) { 
    
  }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObbj = this.data.Obj;
     // console.log(this.registerObbj)
      //this.dsRaisedIndent = this.registerObbj
      this.chargeslist.data = this.registerObbj;
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
  getRaisedIndent() {
    this.dsRaisedIndent.data = this.chargeslist.data;
    this.dsRaisedIndent.sort = this.sort;
    this.dsRaisedIndent.paginator = this.paginator;
  }

  OnSave() {
    if ((!this.dsRaisedIndent.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vToStored == '' || this.vToStored == null || this.vToStored == undefined)) {
      this.toastr.warning('Please select To Store Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isCheckIndentQty = this.dsRaisedIndent.data.some(item => item.IndentQty === this._Reorderlevelsummery.RaisedIndentFrom.get('IndentQty').value);
    if(!isCheckIndentQty){
      this.Savebtn = true;
      let InsertIndentObj = {};
      InsertIndentObj['indentDate'] = this.dateTimeObj.date;
      InsertIndentObj['indentTime'] = this.dateTimeObj.time;
      InsertIndentObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      InsertIndentObj['toStoreId'] = this._Reorderlevelsummery.RaisedIndentFrom.get('ToStoreId').value.StoreId;
      InsertIndentObj['addedby'] = this.accountService.currentUserValue.user.id;
      InsertIndentObj['comments'] = '';
  
      let InsertIndentDetObj = [];
      this.dsRaisedIndent.data.forEach((element) => { 
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemId;
        IndentDetInsertObj['qty'] = element.IndentQty;
        InsertIndentDetObj.push(IndentDetInsertObj);
      });
  
      let submitData = {
        "insertIndent": InsertIndentObj,
        "insertIndentDetail": InsertIndentDetObj,
      };
  
      console.log(submitData);
  
      this._Reorderlevelsummery.RaisedIndentSave(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Raised Indent Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset();
          this.onClose();
          this.Savebtn = false;
        } else {
          this.toastr.error('New Raised Indent Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('New Raised Indent Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }else{
      this.toastr.warning('Please enter Indent Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
    }

  
}



  deleteTableRow(elm) {
    this.dsRaisedIndent.data = this.dsRaisedIndent.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  OnReset() {
    this.chargeslist.data = [];
    this.dsRaisedIndent.data = [];
    this._Reorderlevelsummery.RaisedIndentFrom.reset();
    //this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }
}
export class RaisedIndentList {
  ItemId: any;
  ItemName: string;
  Packing: any;
  BalQty: any;
  StripQty: any;
  IndentQty: any;
  position: number;

  constructor(RaisedIndentList) {
    {
      this.ItemName = RaisedIndentList.ItemName || '';
      this.Packing = RaisedIndentList.Packing || 0;
      this.ItemId = RaisedIndentList.ItemId || 0;
      this.BalQty = RaisedIndentList.BalQty || 0;
      this.StripQty = RaisedIndentList.StripQty || 0;
      this.IndentQty = RaisedIndentList.IndentQty || 0;
    }
  }
}