import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesReturnBillService } from '../brows-sales-return-bill.service';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-accept-material-list-popup',
  templateUrl: './accept-material-list-popup.component.html',
  styleUrls: ['./accept-material-list-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class AcceptMaterialListPopupComponent implements OnInit {

  tempItemlist: any = [];
  
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

  sIsLoading: string = '';
  registerObj:any;
  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<AcceptMaterialListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _SalesReturn: BrowsSalesReturnBillService,
    public _loggedService : AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    if (this.data) {
      this.registerObj =this.data.Obj
      console.log(this.registerObj)
      this.getItemList(this.registerObj.IssueId);
    }
   
  }
  onClose() {
    this.dialogRef.close();
  }
  getItemList(Params) {
   // debugger
    var Param = {
      "IssueId": Params
    }
    this._SalesReturn.getItemdetailList(Param).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      console.log(this.dsItemList.data);
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

     // this.SelectedRowData=this.dsItemList;
  }
  //masterCheckbox: boolean = false;
  selected: boolean = false;
  
  // checkUncheckAll(contact) {
  //   this.dsItemList.data.forEach(contact => contact.selected = this.masterCheckbox);

  //     this.SelectedRowData.push(contact);
  //     console.log(this.SelectedRowData);
    
   
  // }

  SelectedRowData:any=[];
  Acceptedchk:any; 
  tableElementChecked(event ,contact){
    if(contact.selected){
      this.tempItemlist.push(contact);
      console.log(this.tempItemlist);
    }
  }
  onSubmit() {
    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if(this.dsItemList.data.length == this.tempItemlist.length){
      this.Acceptedchk = 1;  
    }else{
      this.Acceptedchk = 0;
    }
   
    let materialAcceptIssueHeader = {};
    materialAcceptIssueHeader['issueId'] = parseInt(this.registerObj.IssueId);
    materialAcceptIssueHeader['acceptedBy'] =this._loggedService.currentUserValue.user.id;
    materialAcceptIssueHeader['IsAccepted'] = this.Acceptedchk;

    
    let materialAcceptIssueDetails = [];
    this.tempItemlist.forEach((element) => { 
      let materialAcceptIssueDetailsObj = {};
      materialAcceptIssueDetailsObj['issueId'] = element.IssueId;
      materialAcceptIssueDetailsObj['issueDetId'] = element.IssueDepId;
      let selectedchk="0";
      if (element.selected == 1) {
        selectedchk = "1";
      } else if (element.selected != 1) {
        selectedchk = "0";
      }

      debugger
      materialAcceptIssueDetailsObj['Status'] = selectedchk;
      materialAcceptIssueDetails.push(materialAcceptIssueDetailsObj);
    });

    let materialAcceptStockUpdate = {};
    materialAcceptStockUpdate['issueId'] = parseInt(this.registerObj.IssueId); 

    let submitData = {
      "materialAcceptIssueHeader": materialAcceptIssueHeader,
      "materialAcceptIssueDetails": materialAcceptIssueDetails,
      "materialAcceptStockUpdate":materialAcceptStockUpdate 
    };
    console.log(submitData);
    this._SalesReturn.AcceptmaterialSave(submitData).subscribe(response => {
      console.log(response)
      if (response) {
        this.toastr.success('Record Accept material Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this._matDialog.closeAll();
      } else {
        this.toastr.error('New Accept material Data not saved !, Please check  error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Accept material not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }

}
export class ItemList {
  ItemName: string;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
 // selected:any;
  selected:any;

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
