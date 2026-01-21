import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UpdateWorkorderComponent } from './update-workorder/update-workorder.component';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';



@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class WorkOrderComponent implements OnInit {
IsAdd: boolean = this.permissionService.getPermission(permissionCodes.WorkOrder, permissionType.Add);
  
  myform: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"

  SupplierId = "0";
  StoreId = "2";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [

    { heading: "WO No", key: "wono", sort: true, align: 'left', emptySign: 'NA', width: 50 },
    { heading: "Date", key: "woDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "TotalAmt", key: "woTotalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "GstAmount", key: "woVatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "DiscAmount", key: "woDiscAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

    { heading: "Netamount", key: "woNetAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Remark", key: "woRemark", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  constructor(public _WorkOrderService: WorkOrderService, public _matDialog: MatDialog, public datePipe: DatePipe,
    private commonService: PrintserviceService,public permissionService: PagePermissionService,
    public toastr: ToastrService, private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  gridConfig: gridModel = {
     permissionCode: permissionCodes.WorkOrder,

    apiUrl: "WorkOrder/WorkOrderHeaderList",
    columnsList: this.allcolumns,
    sortField: "WOId",
    sortOrder: 0,
    filters: [
      { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
    ]
  }

  ngOnInit(): void {
    this.myform = this.createseacrhform();
  }

  createseacrhform(): FormGroup {
    return this._formBuilder.group({
      ToStoreId: [this.accountService.currentUserValue.user.storeId],
      SupplierId: [0],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()]
    });
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      that.grid.bindGridData();
    });
  }

  viewgetReportPdf(element) {
    console.log(element)
    this.commonService.Onprint("WOId", element.woId, "WorkOrder");
  }

  ListView(value) {
    if (value.value !== 0)
      this.StoreId = value.value
    else
      this.StoreId = "0"
    this.onChangeFirst(value);
  }

  ListView1(value) {
    if (value.value !== 0)
      this.SupplierId = value.value
    else
      this.SupplierId = "0"
    this.onChangeFirst(value);
  }

  onChangeFirst(value) {
    debugger
    this.fromDate = this.datePipe.transform(this.myform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myform.get('enddate').value, "yyyy-MM-dd")
    this.StoreId = String(this.StoreId)
    this.SupplierId = this.SupplierId

    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "WorkOrder/WorkOrderHeaderList",
      columnsList: this.allcolumns,
      sortField: "WOId",
      sortOrder: 0,
      filters: [
        { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
      ],
      row: 25
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }

  OnEdit(contact) {
    console.log(contact)

    const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();
    });
  }

}

