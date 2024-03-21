import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesReturnBillService } from '../brows-sales-return-bill.service';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';

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
  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<AcceptMaterialListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _SalesReturn: BrowsSalesReturnBillService,
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    if (this.data) {
      this.getItemList(this.data.Obj.IssueId);
      setTimeout(() => {
      }, 2000);
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
      console.log(this.dsItemList);
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

      this.SelectedRowData=this.dsItemList;
      this.temparray = this.dsItemList;
      console.log(this.SelectedRowData);
  }
  masterCheckbox: boolean = false;
  selected: boolean = true;
  
  checkUncheckAll(contact) {
    this.dsItemList.data.forEach(contact => contact.selected = this.masterCheckbox);

      this.SelectedRowData.push(contact);
      console.log(this.SelectedRowData);
    
   
  }

  SelectedRowData:any=[];
  temparray:any=[];
  
  tableElementChecked(event ,contact){
    if(contact.selected){
      contact.Status = 'Accepted'
      // this.tempItemlist=this.tempItemlist;

      this.tempItemlist.push(contact);
      console.log(this.tempItemlist);
      // this.temparray = this.S.data;
    }
    else{

    }
    // else{
    //   contact.Status = 'Rejected'
    //   contact.selected=false;
    //   debugger
    
    //   //let index = this.temparray.indexOf(contact);
    //   let index1 = this.temparray.data.indexOf(contact);
    //      if (index1 >= 0) {
    //     this.temparray.data.splice(index1, 1);
        
    //     //this.SelectedRowData.data = [];
    //    this.temparray.data =  this.SelectedRowData.data ;
    //   }

    //   console.log(this.temparray.data);
    //   console.log(this.SelectedRowData.data);

      
    // }
    // this.dsItemList= this.SelectedRowData;
    // console.log(this.dsItemList);

  }
  onSubmit() {
    if ((!this.dsItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let materialAcceptIssueHeader = {};
    materialAcceptIssueHeader['issueId'] = this.data.Obj.IssueId;
    materialAcceptIssueHeader['acceptedBy'] = 1;

    let materialAcceptIssueDetails = [];
    this.tempItemlist.forEach((element) => {
      let materialAcceptIssueDetailsObj = {};
      materialAcceptIssueDetailsObj['issueId'] = element.IssueId;
      materialAcceptIssueDetailsObj['issueDetId'] = element.IssueDepId;
      let statuschk
      if (element.selected == 1) {
        statuschk = 1;
      } else if (element.selected != 1) {
        statuschk = 0;
      }
      materialAcceptIssueDetailsObj['status'] = statuschk;
      materialAcceptIssueDetails.push(materialAcceptIssueDetailsObj);
    });

    let materialAcceptStockUpdate = {};
    materialAcceptStockUpdate['issueId'] = this.data.Obj.IssueId;

    let submitData = {
      "materialAcceptIssueHeader": materialAcceptIssueHeader,
      "materialAcceptIssueDetails": materialAcceptIssueDetails,
      "materialAcceptStockUpdate":materialAcceptStockUpdate,
    };
    console.log(submitData);
    this._SalesReturn.AcceptmaterialSave(submitData).subscribe(response => {
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
      this.toastr.error('Category not saved !, Please check API error..', 'Error !', {
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
  selected:any;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.IssueQty = ItemList.IssueQty || 0;
      this.Bal = ItemList.Bal || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || '';
      this.selected = ItemList.selected || true;
    }
  }
}
