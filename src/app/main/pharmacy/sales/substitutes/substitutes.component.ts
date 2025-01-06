import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../sales.service';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-substitutes',
  templateUrl: './substitutes.component.html',
  styleUrls: ['./substitutes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SubstitutesComponent implements OnInit {
  
  IssueSearchGroup :UntypedFormGroup;
  isStoreSelected:boolean = false;
  isItemIdSelected:boolean = false;

  displayedColumns = [
    'ItemName',
    'ItemGenericName'
  ];
  
  ToStoreList: any = [];
  GenericItemList: any = [];

  filteredOptionsStoreList: Observable<string[]>;
  filteredOptionsGenericItemList: Observable<string[]>;

  sIsLoading: string = '';
  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<SubstitutesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _SalesService: SalesService,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.IssueSearchGroup= this.IssueSearchFrom();
   }

   IssueSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
    });
  }

  ngOnInit(): void {
  }

 
  filteredOptions: any;
  PatientListfilteredOptions: any;
  noOptionFound: boolean = false;

  getPhoneAppointmentList() {
    var m_data = {
      "ItemName": `${this.IssueSearchGroup.get('ToStoreId').value}%`
    }
    if (this.IssueSearchGroup.get('ToStoreId').value.length >= 1) {
      this._SalesService.getItemListSearchList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionText(option) {
    if (!option) return '';
    return option.ItemName;
  }
  getSelectedObjPhone(obj) {
    console.log(obj);
    this.getItemList(obj);
  }

// ========================
  GenericfilteredOptions: any;
  GenericListfilteredOptions: any;
  noOptionFoundgen: boolean = false;
  getGenericList() {
    var g_data = {
      "ItemName": `${this.IssueSearchGroup.get('FromStoreId').value}%`
    }
    if (this.IssueSearchGroup.get('FromStoreId').value.length >= 1) {
      this._SalesService.getGenericNameList(g_data).subscribe(resData => {
        this.GenericfilteredOptions = resData;
        this.GenericListfilteredOptions = resData;
        if (this.GenericfilteredOptions.length == 0) {
          this.noOptionFoundgen = true;
        } else {
          this.noOptionFoundgen = false;
        }
      });
    }
  }
  getOptionTextGeneric(option) {
    if (!option) return '';
    return option.ItemGenericName;
  }
  getSelectedObjGeneric(obj) {
    console.log(obj);
    this.getItemList(obj);
  }


  getItemList(Param) {
    var data = {
      "ItemId": Param.ItemID || 0,
      "ItemGenericId": Param.ItemGenericNameId || 0,
    }
    this._SalesService.getSubstitutes(data).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClose() {
    this.dialogRef.close();
  }

}
export class ItemList {
  ItemName: string;
  BatchNo: number;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.BatchNo = ItemList.BatchNo || 0;
    }
  }
}
