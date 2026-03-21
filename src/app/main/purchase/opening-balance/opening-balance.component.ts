import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewOpeningBalanceComponent } from './new-opening-balance/new-opening-balance.component';
import { OpeningBalanceService } from './opening-balance.service';

@Component({
    selector: 'app-opening-balance',
    templateUrl: './opening-balance.component.html',
    styleUrls: ['./opening-balance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class OpeningBalanceComponent {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.OpeningBalance, permissionType.Add);


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

        { heading: "DateTime", key: "openingDateTime", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Transection No", key: "openingDocNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "AdddedBy Name", key: "adddedByName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        {
            heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    gridConfig: gridModel = {
        permissionCode: permissionCodes.OpeningBalance,
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
        console.log("detailList:", data)
        const ID = data.openingHId;

        this.gridConfig1 = {
            apiUrl: "OpeningBalance/OpeningBalnceItemDetailList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
                { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Exp.Date", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "totalQty", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "MRP", key: "perUnitMrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
                { heading: "Pure.Rate", key: "perUnitPurRate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
                { heading: "LandedRate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
                { heading: "CGST(%)", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "SGST(%)", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IGST(%)", key: "igstPer", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "GST(%)", key: "gstper", sort: true, align: 'left', emptySign: 'NA' }

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
        public datePipe: DatePipe, public permissionService: PagePermissionService,) { }

    ngOnInit(): void {
        this.mysearchform = this._OpeningBalanceService.createsearchFormGroup();
    }


    viewgetReportPdf(element) {
        const Param = {
            "searchFields": [
                {
                    "fieldName": "OpeningHId",
                    "fieldValue": String(element.openingHId),
                    "opType": "Equals"
                }
            ],
            "mode": "OpeningBalance"
        }
        this._OpeningBalanceService.getReportView(Param).subscribe(res => {

            const matDialog = this._matDialog.open(PdfviewerComponent,
                {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "OpeningBalance" + " " + "Viewer"
                    }
                });
            matDialog.afterClosed().subscribe(result => {
            });
        });

    }


    onSave(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(NewOpeningBalanceComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '96%',
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
        this.onChangeFirst();
    }


    onChangeFirst() {
        // debugger
        this.fromDate = this.datePipe.transform(this.mysearchform.get('startdate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.mysearchform.get('enddate').value, "yyyy-MM-dd")
        this.StoreId = String(this.StoreId)
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
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
                width: '96%',
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