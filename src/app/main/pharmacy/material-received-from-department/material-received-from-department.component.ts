import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { AcceptMaterialListPopupComponent } from './accept-material-list-popup/accept-material-list-popup.component';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MaterialReceivedFromDepartmentService } from './material-received-from-department.service';

@Component({
  selector: 'app-material-received-from-department',
  templateUrl: './material-received-from-department.component.html',
  styleUrls: ['./material-received-from-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
}) 
 
export class MaterialReceivedFromDepartmentComponent implements OnInit {

 
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  Store1List: any = [];
  screenFromString = 'admission-form';
  SpinLoading: boolean = false;
  labelPosition: 'before' | 'after' = 'after';

  DsIssuetodept = new MatTableDataSource<Issuetodept>();

  dsItemList = new MatTableDataSource<ItemList>();

  displayedColumns = [
    'IsAccepted',
    'IssueNo',
    'IssueDate',
    'FromStoreName',
    'ToStoreName',
    'NetAmount',
    'Remark',
    // 'Receivedby',
    'AcceptedBy',
    'AcceptedDatetime',
    'action',
  ];

  displayedColumns1: string[] = [
    'Status',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'VatPercentage',
    'PerUnitLandedRate',
    'LandedTotalAmount',
]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dsIssueItemList = new MatTableDataSource<IssueItemList>();


  constructor(
    public _materialAcceptanceService: MaterialReceivedFromDepartmentService,
    public _matDialog: MatDialog,
    private _loggedService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,

  ) { }
  editbutton:boolean=true;
  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIssueTodept();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
 
  

  getIssueTodept() {
    this.sIsLoading = '';
    var Param = {
      "ToStoreId ": this._loggedService.currentUserValue.user.storeId,
      "From_Dt": this.datePipe.transform(this._materialAcceptanceService.MaterialReturnFrDept.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._materialAcceptanceService.MaterialReturnFrDept.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify ": parseInt(this._materialAcceptanceService.MaterialReturnFrDept.get('Status').value) || 0
    }
    console.log(Param)
    this._materialAcceptanceService.getIssuetodeptlist(Param).subscribe(data => {
      this.DsIssuetodept.data = data as Issuetodept[];
      console.log(this.DsIssuetodept.data)
      this.DsIssuetodept.sort = this.sort;
      this.DsIssuetodept.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  // getItemList(Params) {
  //   var Param = {
  //     "IssueId": Params.IssueId
  //   }
  //   this._materialAcceptanceService.getItemdetailList(Param).subscribe(data => {
  //     this.dsItemList.data = data as ItemList[];
  //     console.log( this.dsItemList.data )
  //     this.dsItemList.sort = this.sort;
  //     this.dsItemList.paginator = this.paginator;
  //     this.sIsLoading = '';
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }
  getIssueItemwiseList(Param) {
    var vdata = {
        "IssueId": Param.IssueId
    }
    console.log(vdata)
    this._materialAcceptanceService.getItemDetList(vdata).subscribe(data => {
        this.dsIssueItemList.data = data as IssueItemList[];
        console.log(this.dsIssueItemList.data)
        this.dsIssueItemList.sort = this.sort;
        this.dsIssueItemList.paginator = this.paginator;
    });
}

  onEdit(contact) {
    if(contact.PendingByDepartment > 0){
      console.log(contact);
      const dialogRef = this._matDialog.open(AcceptMaterialListPopupComponent,
        {
          maxWidth: "75vw",
          height: '650px',
          width: '100%',
          data: {
            Obj: contact,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getIssueTodept();
      });
    }else{
      this.toastr.warning('Already material accepted.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
   
  }


  onclickrow(contact) {
    // Swal.fire("Row selected :" + contact)
  }
  getIndentStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._materialAcceptanceService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._materialAcceptanceService.MaterialReturnFrDept.get('ToStoreId').setValue(this.Store1List[0]);
    });

  }


  viewgetMaterialrecfrdeptReportPdf(contact) {
    this.sIsLoading == 'loading-data'

    setTimeout(() => {
        this.SpinLoading = true;
        //  this.AdList=true;
        this._materialAcceptanceService.getMaterialreceivedfrDeptview(contact.IssueId).subscribe(res => {
            const dialogRef = this._matDialog.open(PdfviewerComponent,
                {
                    maxWidth: "95vw",
                    height: '850px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Material Received From Dept Reprt Viewer"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                this.sIsLoading = '';
            });
        });
    }, 1000);
}



  onClear() {

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
      this.selected = ItemList.selected || 0;
    }
  }
}

export class Issuetodept {
  IssueNo: any;
  IssueDate: any;
  FromStoreName: any;
  ToStoreName: any;
  NetAmount: any;
  Remark: any;
  Receivedby: any;
  FromStoreId: any;

  /**
   * Constructor
   *
   * @param Issuetodept
   */
  constructor(Issuetodept) {
    {
      this.IssueNo = Issuetodept.IssueNo || 0;
      this.IssueDate = Issuetodept.IssueDate || '';
      this.FromStoreName = Issuetodept.FromStoreName || "";
      this.ToStoreName = Issuetodept.ToStoreName || "";
      this.NetAmount = Issuetodept.NetAmount || 0;
      this.Remark = Issuetodept.Remark || "";
      this.Receivedby = Issuetodept.Receivedby || "";

    }
  }
}
export class IssueItemList {
  ItemId: any;
  ItemName: string;
  BatchNo: number;
  BatchExpDate: number;
  Qty: number;
  PerUnitLandedRate: number;
  LandedTotalAmount: number;
  VatPercentage: number;
  StoreId: any;
  StoreName: any;

  constructor(IssueItemList) {
      {
          this.ItemId = IssueItemList.ItemId || 0;
          this.ItemName = IssueItemList.ItemName || "";
          this.BatchNo = IssueItemList.BatchNo || 0;
          this.BatchExpDate = IssueItemList.BatchExpDate || 0;
          this.Qty = IssueItemList.Qty || 0;
          this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
          this.LandedTotalAmount = IssueItemList.LandedTotalAmount || 0;
          this.VatPercentage = IssueItemList.VatPercentage || 0;
          this.StoreId = IssueItemList.StoreId || 0;
          this.StoreName = IssueItemList.StoreName || "";
      }
  }
}


