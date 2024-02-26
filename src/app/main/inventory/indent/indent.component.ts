import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
  isItemIdSelected: boolean = false;
  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any = [];
  screenFromString = 'admission-form';
  Status: boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  vItemId: any;
  ItemName: any;
  vQty: any;
  chargeslist: any = [];

  dsIndentSearchList = new MatTableDataSource<IndentID>();

  dsIndentDetailsSearchList = new MatTableDataSource<IndentList>();

  dsIndentNameList = new MatTableDataSource<IndentNameList>();
  dsTempItemNameList = new MatTableDataSource<IndentNameList>();
  displayedColumns = [
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

  displayedColumns2 = [
    'ItemID',
    'ItemName',
    'IndentQuantity',
    'Action'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
    //service filter
    public ToStoreFilterCtrl: FormControl = new FormControl();
    public filteredToStore: ReplaySubject<any> = new ReplaySubject<any>(1);
    private _onDestroy = new Subject<void>();
  constructor(
    public _IndentService: IndentService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService

  ) { }


  ngOnInit(): void {
    // this.getFromStoreSearchList();
    this.getIndentItemName();
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getIndentID();
    this.getTostoreListCombobox();

    this.ToStoreFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterServicename();
    });

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "FromStoreId":this._loggedService.currentUserValue.user.storeId,
      "ToStoreId":this._IndentService.IndentSearchGroup.get('ToStoreId').value.StoreId || 0,
      "From_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": this._IndentService.IndentSearchGroup.get("Status").value,
    }

    //console.log(Param);
    this._IndentService.getIndentID(Param).subscribe(data => {
      this.dsIndentSearchList.data = data as IndentID[];
      this.dsIndentSearchList.sort = this.sort;
      this.dsIndentSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getIndentList(Params) {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "IndentId": Params.IndentId
    }
    console.log(Param)
    this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentDetailsSearchList.data = data as IndentList[];
      this.dsIndentDetailsSearchList.sort = this.sort;
      this.dsIndentDetailsSearchList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsIndentDetailsSearchList)
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getToStoreSearchList() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
     // console.log(this.ToStoreList);
    });
  }
  getFromStoreSearchList() {
    var data = {
      "Id": this._loggedService.currentUserValue.user.storeId
    }
    this._IndentService.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentService.IndentSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
      this._IndentService.newIndentFrom.get('FromStoreId').setValue(this.FromStoreList[0]);

    });
  }
    // Service name filter
    private filterServicename() {
      if (!this.ToStoreList) {
  
        return;
      }
      // get the search keyword
      let search = this.ToStoreFilterCtrl.value;
      if (!search) {
        this.filteredToStore.next(this.ToStoreList.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredToStore.next(
        this.ToStoreList.filter(bank => bank.StoreName.toLowerCase().indexOf(search) > -1)
      );
    }
    getTostoreListCombobox() {
      this._IndentService.getToStoreNameSearch().subscribe(data => {
        this.ToStoreList = data;
        this.filteredToStore.next(this.ToStoreList.slice());
      });
    }

  getIndentItemName() {
   // debugger
    var Param = {
      "ItemName": `${this._IndentService.newIndentFrom.get('ItemName').value}%`,
      "StoreId":this._loggedService.currentUserValue.user.storeId,
    }
    //console.log(Param)
    this._IndentService.getIndentNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      //console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedObj(obj) {
   // console.log(obj)
    this.vItemId = obj.ItemID,
      this.ItemName = obj.ItemName;
    this.vQty = 0;
    this.qty.nativeElement.focus();
  }
  onRepeat() {
    if (this.chargeslist.length > 0) {
      this.chargeslist.forEach((element) => {
        if (element.ItemID == this.vItemId) {
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.ItemReset();
        } else {
          this.onAdd();
        }
      });
    } else {
      this.onAdd();
    }
  }

  onAdd() {
    if(this.vQty > 0){
    this.dsIndentNameList.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    this.chargeslist.push(
      {
        ItemID: this._IndentService.newIndentFrom.get('ItemId').value || 0,
        ItemName: this._IndentService.newIndentFrom.get('ItemName').value.ItemName,
        IndentQuantity: this._IndentService.newIndentFrom.get('Qty').value || 0,
      });
   // console.log(this.chargeslist);
    this.dsIndentNameList.data = this.chargeslist;
    this.ItemReset();
    this.itemname.nativeElement.focus();
    }else{
      Swal.fire('Please Enter Qty');
    }

  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsIndentNameList.data = [];
      this.dsIndentNameList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  vItemName: any;
  ItemReset() {
    this.vItemId =  0;
    this.ItemName = '';
    this.vItemName = ' ';
    // this._IndentService.newIndentFrom.get('ItemName').setValue('');
    this.vQty = 0;
  }
  OnSave() {
   // debugger
   if ((!this.dsIndentNameList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
    if (this._IndentService.newIndentFrom.valid) {
      let InsertIndentObj = {};
      InsertIndentObj['indentDate'] = this.dateTimeObj.date;
      InsertIndentObj['indentTime'] = this.dateTimeObj.time;
      InsertIndentObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      InsertIndentObj['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;
      InsertIndentObj['addedby'] = this.accountService.currentUserValue.user.id;

      let InsertIndentDetObj = [];
      this.dsIndentNameList.data.forEach((element) => {
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemID;
        IndentDetInsertObj['qty'] = element.IndentQuantity;
        InsertIndentDetObj.push(IndentDetInsertObj);
      });

      let submitData = {
        "insertIndent": InsertIndentObj,
        "insertIndentDetail": InsertIndentDetObj,
      };

      console.log(submitData);

      this._IndentService.InsertIndentSave(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record New Indent Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          //this._matDialog.closeAll();
          this.OnReset();

        } else {
          this.toastr.error('New Issue Indent Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('New Issue Indent Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
   
    } else {
      error => {
        this.toastr.error('New Issue Indent Data not saved !, Please check Validation ..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }
  }
  
  selectedIndex: string = '';
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  OnEdit(row,tabGroup: MatTabGroup){
    // debugger
   
    const tabIndex = row === 'tab1' ? 0 : 1;
    tabGroup.selectedIndex = tabIndex;
    console.log(row)
     var  vdata={
      ToStoreId: row.ToStoreId,
      StoreName: row.ToStoreName
      }
      console.log(vdata)
      this._IndentService.populateForm(vdata);
  
     
      const selectedToStore = this.ToStoreList.filter(c => c.StoreId == row.ToStoreId);
      this._IndentService.newIndentFrom.get('ToStoreId').setValue(selectedToStore);
    
       console.log(selectedToStore);
       console.log(row.ToStoreId)
       this.getupdateIndentList(row);

  }
  getupdateIndentList(Params) {
    var Param = {
      "IndentId": Params.IndentId
    }
    console.log(Param)
      this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentNameList.data = data as IndentNameList[];
      this.chargeslist = data as IndentNameList[];
      this.dsIndentNameList.sort = this.sort;
      this.dsIndentNameList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsIndentNameList)
    },
      error => {
        this.sIsLoading = '';
      });
  }
//   OnEdit(row,tabGroup:MatTabGroup) {
//     var m_data = {
//       ToStoreId: row.ToStoreName,
//      // StoreName: row.ToStoreName
//       //   CategoryName: row.CategoryName.trim(),
//       //   IsDeleted: JSON.stringify(row.Isdeleted),
//       //   UpdatedBy: row.UpdatedBy,
//     };
//     console.log(m_data)
//     console.log(row);
//     const tabIndex = row === 'tab1' ? 0 : 1;
//     tabGroup.selectedIndex = tabIndex;
//     this._IndentService.populateForm(m_data);
//     const selectedToStore = this.ToStoreList.filter(c => c.StoreId == row.ToStoreId);
//     this._IndentService.newIndentFrom.get('ToStoreId').setValue(selectedToStore);
//     console.log(selectedToStore);
//     console.log(row.ToStoreId)
// }
    OnReset() {
      this._IndentService.newIndentFrom.reset();
      this.dsIndentNameList.data = [];
    }
    onClear(){
      this._IndentService.IndentSearchGroup.reset();
    }

    @ViewChild('itemname') itemname: ElementRef;
    @ViewChild('qty') qty: ElementRef;
 
  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus();
    }
  }
  public onEnteritemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      //this.itemid.nativeElement.focus();
    }
  }
}

export class IndentNameList {
  Action: any;
  ItemID: any;
  ItemName: string;
  Qty: number;
  HospitalBalance: number;
  IndentQuantity: number;
  CurrentBalance: number;
  position: number;

  /**
   * Constructor
   *
   * @param IndentNameList
   */
  constructor(IndentNameList) {
    {
      this.Action = IndentNameList.Action || 0;
      this.ItemID = IndentNameList.ItemID || 0;
      this.ItemName = IndentNameList.ItemName || "";
      this.Qty = IndentNameList.Qty || 0;
      this.HospitalBalance = IndentNameList.HospitalBalance || 0;
      this.IndentQuantity = IndentNameList.IndentQuantity || 0;
      this.CurrentBalance = IndentNameList.CurrentBalance || 0;

    }
  }
}

export class IndentList {

  ItemName: string;
  Qty: number;
  IssQty: number;
  BalQty: any;
  StoreName: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {

      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.BalQty = IndentList.BalQty || 0;
      this.StoreName = IndentList.StoreName || '';
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

function addaddIndentForm() {
  throw new Error('Function not implemented.');
}

