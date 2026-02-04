import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MaterialReceivedFromDepartmentService } from '../material-received-from-department.service';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accept-material-list-popup',
  templateUrl: './accept-material-list-popup.component.html',
  styleUrls: ['./accept-material-list-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class AcceptMaterialListPopupComponent implements OnInit {

  tempItemlist: any = [];
  MaterialForm: FormGroup;
  selected: boolean = false;

  SelectedRowData: any = [];
  Acceptedchk: any;
  sIsLoading: string = '';
  registerObj: any;
  checklist: any[] = [];
  masterSelected: any = false;
  displayedColumns = [
    'Action',
    'Status',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'IssueQty',
    'PerUnitLandedRate',
    'LandedTotalAmount',
    'VatPercentage'
  ];


  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<AcceptMaterialListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder, private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _materialAcceptanceService: MaterialReceivedFromDepartmentService,
    public _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    this.MaterialForm = this.creatematerial()
    this.itemdetailarray.push(this.itemdetailform());

    if (this.data) {
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
      this.getItemList(this.registerObj.issueId)

    }

  }

  get itemdetailarray(): FormArray {
    return this.MaterialForm.get('materialAcceptIssueDetails') as FormArray;
  }


  creatematerial() {
    return this._formBuilder.group({
      "materialAcceptIssueHeader": this._formBuilder.group({
        "issueId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "acceptedBy": [this.accountService.currentUserValue.user.userId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "IsAccepted": [true, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      "materialAcceptIssueDetails": this._formBuilder.array([]),
      "materialAcceptStockUpdate": this._formBuilder.group({
        "issueId": 0
      })
    });
  }


  itemdetailform(element: any = {}): FormGroup {
    console.log(element)
    return this._formBuilder.group({
      issueId: [element.issueId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issueDepId: [element.issueDepId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      status: [element.status || 0]
    });
  }

  getItemList(IssueId) {
debugger
    var vdata = {
      "first": 0,
      "rows": 999,
      "sortField": "IssueId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "IssueId",
          "fieldValue": String(IssueId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }

    this._materialAcceptanceService.getAccItemdetailList(vdata).subscribe(data => {
      this.dsItemList.data = data.data as ItemList[];
      console.log(this.dsItemList.data);
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


  }

checkboxgflag=0
  tableElementChecked(event, contact) {
    debugger
    if (contact.selected) {
    this.checkboxgflag=1
      if (contact.status != 'A'){
          this.tempItemlist.push(contact);
        console.log(this.tempItemlist);
      }
      else {
        Swal.fire('Item Already Accepted...')
        return;
      }
    }
    else if (this.masterSelected) {
      if (contact.selected == false) {
        let index = this.tempItemlist.indexOf(contact);
        if (index >= 0) {
          this.checklist.splice(index, 1);
          this.tempItemlist = [];
          this.tempItemlist = this.checklist;
          console.log(this.tempItemlist);
        }
      }
      this.masterSelected = false;
    }
  }


  checkUncheckAll() {
    debugger
    if (this.masterSelected == true) {
          this.checkboxgflag=1
      this.dsItemList.data.forEach(contact => {
      contact.selected = true;
      });
      this.checklist = this.dsItemList.data;
      this.tempItemlist = this.checklist;
    } else {
      this.dsItemList.data.forEach(contact => {
        contact.selected = false;
        this.checklist = [];
        this.tempItemlist = [];
        console.log(this.checklist)
      });
    }

  }

  onSubmit() {
    debugger
    if( this.checkboxgflag==0){
        this.toastr.warning('Data is not Selected in list ..', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.tempItemlist.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.dsItemList.data.length) {
      if (this.dsItemList.data.length == this.tempItemlist.length) {
        this.Acceptedchk = true;
      } else {
        this.Acceptedchk = false;
      }

      this.MaterialForm.get('materialAcceptIssueHeader.issueId').setValue(this.registerObj.issueId)
      this.MaterialForm.get('materialAcceptIssueHeader.acceptedBy').setValue(this._loggedService.currentUserValue.userId)
      this.MaterialForm.get('materialAcceptIssueHeader.IsAccepted').setValue(this.Acceptedchk)

      this.itemdetailarray.clear();
      this.tempItemlist.forEach(element => {
        let selectedchk = "0";
        if (element.selected == 1) {
          selectedchk = "1";
        } else if (element.selected != 1) {
          selectedchk = "0";
        }

        element.status = selectedchk
        this.itemdetailarray.push(this.itemdetailform(element));
      });

      this.MaterialForm.get('materialAcceptStockUpdate.issueId').setValue(this.registerObj.issueId)

      console.log(this.MaterialForm.value);
      this._materialAcceptanceService.AcceptmaterialSave(this.MaterialForm.value).subscribe(response => {
        this.dialogRef.close();
        this.viewgetIssuetodeptReportPdf(this.registerObj.issueId)
      });
    }
  }

  viewgetIssuetodeptReportPdf(element) {
    console.log(element)
    this.commonService.Onprint("IssueId", element, "MaterialReceivedByDept");
  }

  onClose() {
    this.dialogRef.close();
  }
}
export class ItemList {
  ItemName: string;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  // selected:any;
  selected: any;

  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.IssueQty = ItemList.IssueQty || 0;
      this.Bal = ItemList.Bal || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || '';
      this.selected = ItemList.selected || 0;
    }
  }
}
