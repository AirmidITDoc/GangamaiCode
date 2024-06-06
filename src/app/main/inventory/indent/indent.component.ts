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
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { NewIndentComponent } from './new-indent/new-indent.component';

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
  displayedColumns = [
    'IsInchargeVerify',
    //'Isclosed',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'action',
  ];
  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];


  vsaveflag: boolean = true;
  SpinLoading: boolean = false;
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
  ToStoreList1: any = [];
  isStoreSelected: boolean = false;
  filteredOptionsStore: Observable<string[]>;
  filteredOptionsStoreList: Observable<string[]>;
  vRemark: any;
  vIndentId: any;
vprintflag:boolean=false;
vToStoreId:any=0;

  dsIndentSearchList = new MatTableDataSource<IndentID>();

  dsIndentDetailsSearchList = new MatTableDataSource<IndentList>();


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
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getIndentID();
   
    this.filteredOptionsStoreList = this._IndentService.IndentSearchGroup.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStoreList(value)),
    );

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getIndentID() {
    var Param = {
      "FromStoreId": this._loggedService.currentUserValue.user.storeId,
      "ToStoreId": this._IndentService.IndentSearchGroup.get('ToStoreId').value.StoreId || 0,
      "From_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": this._IndentService.IndentSearchGroup.get("Status").value || 0,
    }
    console.log(Param)
    this._IndentService.getIndentID(Param).subscribe(data => {
      this.dsIndentSearchList.data = data as IndentID[];
      console.log(this.dsIndentSearchList.data)
      this.dsIndentSearchList.sort = this.sort;
      this.dsIndentSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getIndentList(Params) {
    var Param = {
      "IndentId": Params.IndentId
    }
    this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentDetailsSearchList.data = data as IndentList[];
      console.log(this.dsIndentDetailsSearchList.data)
      this.dsIndentDetailsSearchList.sort = this.sort;
      this.dsIndentDetailsSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
  viewgetIndentVerifyReportPdf(contact) {
    console.log(contact)
    this.sIsLoading == 'loading-data'
    setTimeout(() => {
    this.SpinLoading =true;
    this._IndentService.getIndentVerifyview(contact.IndentId).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Indent Verify Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }


     
  viewgetIndentReportPdf(contact) {
    
    console.log(contact)
    this.sIsLoading == 'loading-data'
  
    setTimeout(() => {
    this.SpinLoading =true;
    let IndentId= contact.IndentId
  this._IndentService.getIndentwiseview(IndentId).subscribe(res => {
     
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Indent Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }

  vStoreId2: any = 0
  getToStoreSearchList() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList1 = data;
      //console.log(this.ToStoreList1)
    });
  }
  private _filterToStoreList(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList1.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStoresList(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getFromStoreSearchList() {
    var data = {
      "Id": this._loggedService.currentUserValue.user.storeId
    }
    this._IndentService.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentService.IndentSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }


  OnEdit(row) {
    const dialogRef = this._matDialog.open(NewIndentComponent,
      {
          maxWidth: "100%",
          height: '95%',
          width: '95%',
          data:{
            Obj :row
          }
      });
  dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    this.getIndentID();
  });
  }

  onVerify(row) {
    var vdata = {
      "indentVerify": {
        "indentId": row.IndentId,
        "isInchargeVerify": true,
        "isInchargeVerifyId": 1
      }
    }
    console.log(vdata);
    console.log(row);
    this._IndentService.VerifyIndent(vdata).subscribe(response => {
      if (response) {
        this.toastr.success('Record Indent Verified Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getIndentID();
      } else {
        this.toastr.error('Record Indent Data not Verified !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('Record Indent Data not Verified mmmmmmmmmm!, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  NewIndent() {
    const dialogRef = this._matDialog.open(NewIndentComponent,
        {
            maxWidth: "100%",
            height: '95%',
            width: '95%',
        });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      this.getIndentID();
    });
} 
onClear() {
  this._IndentService.IndentSearchGroup.reset();
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

