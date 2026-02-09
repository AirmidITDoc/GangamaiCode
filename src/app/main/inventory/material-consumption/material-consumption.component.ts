import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialConsumptionService } from './material-consumption.service';
import { NewMaterialConsumptionComponent } from './new-material-consumption/new-material-consumption.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';

@Component({
    selector: 'app-material-consumption',
    templateUrl: './material-consumption.component.html',
    styleUrls: ['./material-consumption.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaterialConsumptionComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.MaterialConsumption, permissionType.Add);
      
    hasSelectedContacts: boolean;
    myFilterform: FormGroup;
    autocompletestore: string = "Store";

    StoreId = this.accountService.currentUserValue.user.storeId
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('Status') Status!: TemplateRef<any>;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'admId')!.template = this.Status;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    allcolumns = [
       
        { heading: "-", key: "admId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Date Time", key: "consumptionTime", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Landed Total Amt", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 200, type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Added By", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate 
        }
    ]
    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    gridConfig: gridModel = {
         permissionCode: permissionCodes.MaterialConsumption,
        apiUrl: "MaterialConsumption/MaterialConsumptionList",
        columnsList: this.allcolumns,
        sortField: "MaterialConsumptionId",
        sortOrder: 0,
        filters: [{ fieldName: "ToStoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
        ]
    }

    constructor(
        public _MaterialConsumptionService: MaterialConsumptionService, public _formBuilder: UntypedFormBuilder, private commonService: PrintserviceService,
        public toastr: ToastrService, public _matDialog: MatDialog, public datePipe: DatePipe, private accountService: AuthenticationService,public permissionService: PagePermissionService,
    ) { }

    ngOnInit(): void { this.myFilterform = this._MaterialConsumptionService.createSearchFrom(); }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    NewMatrialCon() {
        const dialogRef = this._matDialog.open(NewMaterialConsumptionComponent,
            {
                maxHeight: '98vh',
                width: '95%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
            this.isShowDetailTable = false;
        });
    }

    getSelectedRow(row: any): void {

        console.log("selectedRow:", row)
        let materialConsumptionId = row.materialConsumptionId

        this.gridConfig1 = {
            apiUrl: "MaterialConsumption/MaterialConsumptionDetailsList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
                { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 170 },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 70 },
                { heading: "PerUnit Purchase", key: "perUnitPurchaseRate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount  },
                { heading: "PerUnit LandedRate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount  },
                { heading: "PerUnit MRPRate", key: "perUnitMRPRate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount  },
                { heading: "Pur TotalAmt", key: "purTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount  },
                { heading: "Landed TotalAmt", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount  },
                { heading: "MRP TotalAmt", key: "mrpTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 , type: gridColumnTypes.amount },
                { heading: "Start Date", key: "startDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "End Date", key: "endDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "Added By", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            ],
            sortField: "MaterialConsumptionId",
            sortOrder: 0,
            filters: [
                { fieldName: "MaterialConsumptionId", fieldValue: String(materialConsumptionId), opType: OperatorComparer.Equals }

            ]
        };

        this.isShowDetailTable = true;

        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        });
    }

    ListView(value) {
        if (value.value !== 0)
            this.StoreId = value.value
        else
            this.StoreId = "0"
        this.onChangeFirst(value);
    }

    onChangeFirst(value) {
        debugger
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.StoreId = this.myFilterform.get("ToStoreId").value || this.StoreId

        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "MaterialConsumption/MaterialConsumptionList",
            columnsList: this.allcolumns,
            sortField: "MaterialConsumptionId",
            sortOrder: 0,
            filters: [
                { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ],
            row: 25
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }

    onPrint(contact) {
        this.commonService.Onprint("MaterialConsumptionId", contact.materialConsumptionId, "NurMaterialConsumption");
    }

    getValidationMessages() {
        return {
            ToStoreId: [
                  { name: "required", Message: "Store Name is required" }
            ]
        };
    }
}
