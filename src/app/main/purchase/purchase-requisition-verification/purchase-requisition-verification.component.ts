import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PurchaseRequisitionVerificationService } from './purchase-requisition-verification.service';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
  selector: 'app-purchase-requisition-verification',
  templateUrl: './purchase-requisition-verification.component.html',
  styleUrls: ['./purchase-requisition-verification.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PurchaseRequisitionVerificationComponent {

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;
  gridConfig1: gridModel = new gridModel();
  isShowDetailTable: boolean = false;
  @ViewChild('grid1') grid1: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromStore = "0"
  toStore = "0"
  status = "0"
  autocompletestore: string = "Store";
  PurchaseReqVerifyForm: FormGroup;

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allColumns2 = [
    { heading: "No", key: "code", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "From Store", key: "fromStore", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "To Store", key: "toStore", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Is Verify", key: "isVerify", sort: true, align: 'left', emptySign: 'NA', width: 300 }
    // {
    //   heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate
    // }

  ]

  allFilters2 = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "fromStore", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "toStore", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "status", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  constructor(public _PurchasereqVerifyService: PurchaseRequisitionVerificationService, public _matDialog: MatDialog,
    public toastr: ToastrService,private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.PurchaseReqVerifyForm = this._PurchasereqVerifyService.SearchFilterForm();
    this.PurchaseReqVerifyForm.get('FromStoreId').setValue(this.accountService.currentUserValue.user.storeId);
  }

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.allColumns2,
    sortField: "RegNo",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "fromStore", fieldValue: this.fromStore, opType: OperatorComparer.Equals },
      { fieldName: "toStore", fieldValue: this.toStore, opType: OperatorComparer.Equals },
      { fieldName: "status", fieldValue: this.status, opType: OperatorComparer.Equals }
    ]
  }

  onChangeFirst() {
    this.isShowDetailTable = false;
    if (this.PurchaseReqVerifyForm.get('status').value == true) {
      this.status = "1"
    } else {
      this.status = "0"
    }
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "",
      columnsList: this.allColumns2,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "fromStore", fieldValue: this.fromStore, opType: OperatorComparer.Equals },
        { fieldName: "toStore", fieldValue: this.toStore, opType: OperatorComparer.Equals },
        { fieldName: "status", fieldValue: this.status, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  fromStoreView(value) {
    if (value.value !== 0)
      this.fromStore = value.value
    else
      this.fromStore = "0"
    // this.onChangeFirst();
  }

  toStoreView(value) {
    if (value.value !== 0)
      this.toStore = value.value
    else
      this.toStore = "0"
    // this.onChangeFirst();
  }

  GetDetails2(data) {
    // debugger
    this.gridConfig1 = {
      apiUrl: "",
      columnsList: [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bal Qty", key: "balqty", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "PresReId",
      sortOrder: 0,
      filters: [
        { fieldName: "PresReId", fieldValue: String(data.presReId), opType: OperatorComparer.Equals }
      ]
    }
    this.isShowDetailTable = true;
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

}
