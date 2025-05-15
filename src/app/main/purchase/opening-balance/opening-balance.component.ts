import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { OpeningBalanceService } from './opening-balance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { NewOpeningBalanceComponent } from './new-opening-balance/new-opening-balance.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class OpeningBalanceComponent {
  mysearchform: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  StoreId = this.accountService.currentUserValue.user.storeId;
  SupplierId = "0";
  status = "0";

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
     @ViewChild('grid1') grid1: AirmidTableComponent;


  @ViewChild('iconisClosed') iconisClosed!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }

  hasSelectedContacts: boolean;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allcolumns = [

    { heading: "OpeningHId", key: "openingHId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "OpeningDate", key: "openingDate", sort: true, align: 'left', emptySign: 'NA', width: 100},
    { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    { heading: "AdddedByName", key: "adddedByName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
    apiUrl: "OpeningBalance/OpeningBalanceList",
    columnsList: this.allcolumns,
    sortField: "OpeningHId",
    sortOrder: 0,
    filters: [{ fieldName: "Storeid", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ]
  }
  gridConfig1: gridModel = new gridModel();

  isShowDetailTable: boolean = false;
  GetDetails1(data: any): void {
    debugger
    console.log("detailList:", data)
    let ID = 20// data.openingHId;

    this.gridConfig1 = {
      apiUrl: "OpeningBalance/OpeningBalnceItemDetailList",
      columnsList: [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Exp.Date", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Pure.Rate", key: "perUnitPurRate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "MRP", key: "perUnitMrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "GST(%)", key: "vatPer", sort: true, align: 'left', emptySign: 'NA' }

      ],
      sortField: "OpeningHId",
      sortOrder: 0,
      filters: [
        { fieldName: "OpeningHId", fieldValue: String(ID), opType: OperatorComparer.Equals }
      ]
    };
    this.isShowDetailTable = true;
    setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    }, 100);
  }

  constructor(public _OpeningBalanceService: OpeningBalanceService, public _matDialog: MatDialog,
    public toastr: ToastrService, private commonService: PrintserviceService, private accountService: AuthenticationService,
    public datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.mysearchform = this._OpeningBalanceService.createsearchFormGroup();
  }


  viewgetReportPdf(element) {
    this.commonService.Onprint("IndentId", element.indentId, "IndentWiseReport");
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewOpeningBalanceComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '98%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
          that.grid.bindGridData();
                 this.isShowDetailTable = false;
           
        });
  }


  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.StoreId = value.value
    else
      this.StoreId = "0"
    this.onChangeFirst(value);
  }


  onChangeFirst(value) {
    debugger
    this.fromDate = this.datePipe.transform(this.mysearchform.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.mysearchform.get('enddate').value, "yyyy-MM-dd")
    this.StoreId = String(this.StoreId)
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "OpeningBalance/OpeningBalanceList",
      columnsList: this.allcolumns,
      sortField: "OpeningHId",
      sortOrder: 0,
      filters: [
        { fieldName: "Storeid", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
      ],
      row: 25
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }
  vstoreId = 0
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  OnWhatsPoSend() { }


  chkNewGRN: any;
  OnEdit(contact) {
    const dialogRef = this._matDialog.open(NewOpeningBalanceComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact,
          chkNewGRN: this.chkNewGRN
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);

    });


  }



}