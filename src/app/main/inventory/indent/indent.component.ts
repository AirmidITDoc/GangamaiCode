import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { ConfigService } from 'app/core/services/config.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';


@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Indent, permissionType.Add);
    

  hasSelectedContacts: boolean;
  IndentSearchGroup: FormGroup;
  autocompletestore: string = "Store";
  Status = "0"
  FromStore: any = String(this.accountService.currentUserValue.user.storeId);
  Tostore: any = "0"
  IsVerify = "0"
  IsActive = "0"
  IsClosed = "0"
  IsIndentVerify: any;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;


  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
  @ViewChild('detailactionsTemplate') detailactionsTemplate!: TemplateRef<any>;
  @ViewChild('isverifyTemplate') isverifyTemplate!: TemplateRef<any>;
  gridConfig1: gridModel = new gridModel();
  isShowDetailTable: boolean = false;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isclosed')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'priority')!.template = this.actionsTemplate2;
    this.gridConfig.columnsList.find(col => col.key === 'isverify')!.template = this.isverifyTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    // this.gridConfig1.columnsList.find(col => col.key === 'isclosed')!.template = this.detailactionsTemplate;
  }

  allcolumns = [
    // { heading: "Status", key: "isclosed", sort: true, align: 'left', type: gridColumnTypes.template, width: 90 },

    { heading: "Status", key: "isclosed", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Priority", key: "priority", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Is Verify", key: "isverify", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Indent No", key: "indentNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Indent Date", key: "indentDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 150 },
    { heading: "From Store Name", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "To Store Name", key: "toStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Verified By", key: "verifyIncharge", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Remark", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  gridConfig: gridModel = {
     permissionCode: permissionCodes.Indent,
    apiUrl: "Indent/IndentList",
    columnsList: this.allcolumns,
    sortField: "IndentId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
      { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
      // { fieldName: "IsActive", fieldValue: this.IsActive, opType: OperatorComparer.Equals },
      { fieldName: "IsClosed", fieldValue: this.IsClosed, opType: OperatorComparer.Equals }
    ]
  }

  GetDetails1(data) {

    let IndentId = data.indentId
    this.gridConfig1 = {
      apiUrl: "Indent/IndentDetailsList",
      columnsList: [
        { heading: "Status", key: "isclosed", sort: true, align: 'left', type: gridColumnTypes.template, template: this.detailactionsTemplate },
        { heading: "Item Code ", key: "itemId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "QTY", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Issue Qty", key: "issQty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Pending Qty", key: "bal", sort: true, align: 'left', emptySign: 'NA' }

      ],
      sortField: "IndentId",
      sortOrder: 0,
      filters: [
        { fieldName: "IndentId", fieldValue: String(IndentId), opType: OperatorComparer.Equals }

      ]
    }
    this.isShowDetailTable = true;
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

  constructor(
    public _IndentService: IndentService, private commonService: PrintserviceService,
    public toastr: ToastrService, public _matDialog: MatDialog, private accountService: AuthenticationService,
    public datePipe: DatePipe,  public _ConfigService: ConfigService,public permissionService: PagePermissionService,
  ) { }

  ngOnInit(): void {
    this.IndentSearchGroup = this._IndentService.IndentSearchFrom();

    // console.log(this.accountService)
    // this.IsIndentVerify = this.accountService.currentUserValue.user.isIndentVerify
debugger
    console.log(this._ConfigService.configParams)
      const [vIsIndentVerify, IsIndentVerify] = this._ConfigService.configParams.IsIndentVerify.split(":");
    this.IsIndentVerify=parseInt(vIsIndentVerify)
       console.log(this.IsIndentVerify)
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.FromStore = value.value
    else
      this.FromStore = "0"
    this.onChangeFirst(value);
  }

  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.Tostore = value.value
    else
      this.Tostore = "0"
    this.onChangeFirst(value);
  }

  onChangeFirst(value) {
    debugger
    if (this.IndentSearchGroup.get('Verify').value == true) {
      this.IsVerify = "1"
    } else {
      this.IsVerify = "0"
    }

    if (this.IndentSearchGroup.get('Closed').value == true) {
      this.IsClosed = "1"
    } else {
      this.IsClosed = "0"
    }

    // if (this.IndentSearchGroup.get('Active').value == true) {
    //   this.IsActive = "0"
    // } else {
    //   this.IsActive = "1"
    // }

    this.isShowDetailTable = false;
    this.fromDate = this.datePipe.transform(this.IndentSearchGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.IndentSearchGroup.get('enddate').value, "yyyy-MM-dd")
    this.FromStore = this.IndentSearchGroup.get("FromStoreId").value || this.FromStore
    this.Tostore = this.IndentSearchGroup.get("ToStoreId").value || this.Tostore
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Indent/IndentList",
      columnsList: this.allcolumns,
      sortField: "IndentId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
        { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
        // { fieldName: "IsActive", fieldValue: this.IsActive, opType: OperatorComparer.Equals },
        { fieldName: "IsClosed", fieldValue: this.IsClosed, opType: OperatorComparer.Equals }
      ],
      row: 25
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }


  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewIndentComponent,
      {
        maxWidth: "97vw",
        height: '98%',
        width: '96%',
        data: row 
      });
    dialogRef.afterClosed().subscribe(result => {
      that.grid.bindGridData();
      this.isShowDetailTable = false;

    });
  }

  OnEdit(contact) {
    console.log(contact)

    const dialogRef = this._matDialog.open(NewIndentComponent,
      {
        maxWidth: "90vw",
        height: '700px',
        width: '100%',
        data: {
          Obj: contact,
          // chkNewGRN: this.chkNewGRN
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.isShowDetailTable = true;
      this.grid.bindGridData();
    });

  }

  deleteIndent(data) {
    debugger
    Swal.fire({
      title: 'Do you want to cancel the Indent?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        var data = {
          "indentId": data.indentId
        }
        this._IndentService.IndentCancle(data).subscribe((response: any) => {
          this.grid.bindGridData();
        });
      }
    });
  }
  onVerify(row) {
debugger
    let submitData = {
      "indentId": row.indentId,
      "isInchargeVerifyId": this.accountService.currentUserValue.userId

    };
    this._IndentService.getVerifyIndent(submitData).subscribe(response => {
      this.commonService.Onprint("IndentId", row.indentId, "IndentwiseReport");
      this.onChangeFirst(event);

    });
  }
  viewgetIndentReportPdf(contact) {
    this.commonService.Onprint("IndentId", contact.indentId, "IndentwiseReport");
  }

  viewgetIndentVerifyReportPdf(contact) {
    this.commonService.Onprint("IndentId", contact, "IndentWiseReport");
  }
  selectChangeStore(obj: any) {
    this.gridConfig.filters[2].fieldValue = obj.value
  }
}