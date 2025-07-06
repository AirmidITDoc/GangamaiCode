import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { NewPatientwiseMaterialconsumptionComponent } from './new-patientwise-materialconsumption/new-patientwise-materialconsumption.component';
import { PatientwiseMaterialConsumptionService } from './patientwise-material-consumption.service';


@Component({
    selector: 'app-material-consumption-patientwise',
    templateUrl: './material-consumption-patientwise.component.html',
    styleUrls: ['./material-consumption-patientwise.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MaterialConsumptionPatientwiseComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    // @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    autocompleteModedeptdoc: string = "ConDoctor";
    hasSelectedContacts: boolean;
    autocompleteModestore: string = "Store";

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    constructor(public _PatientwiseMaterialConsumptionService: PatientwiseMaterialConsumptionService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        public datePipe: DatePipe,) { }

    ngOnInit(): void {
    }

    gridConfig: gridModel = {
        apiUrl:"IPPrescription/PatietWiseMatetialList",
        columnsList: [
            { heading: "DateTime", key: "datet", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "StoreName", key: "storen", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "LandedTotalAmt", key: "landed", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA'},
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PatientwiseMaterialConsumptionService.deactivateTheStatus(data.materialConsumptionId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "MaterialConsumptionId",
        sortOrder: 0,
        filters: [
            { fieldName: "ToStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "StoreId", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }

    selectChangedeptdoc(obj: any) {

        this.gridConfig.filters[2].fieldValue = obj.value

    }
    getValidationdoctorMessages() {
        return {
            storeId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;

    GetDetails(data) {
        
        this.gridConfig1 = {
        apiUrl:"IPPrescription/PatietWiseMatetialList",
        columnsList: [
            { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "BatchExpDate", key: "batchexpDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PerUnitPurchase", key: "perunitPurchase", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PerUnitLandedR", key: "patientName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PerUnitMRPRate", key: "perunitmrpRate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PurTotalAmt", key: "purtotalamt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "LandedTotalAmt", key: "landtotalamt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "MRPTotalAmt", key: "mrptotalamt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "StartDate", key: "startdate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "EndDate", key: "enddate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA'},
        ],
        sortField: "MaterialConsumptionId",
        sortOrder: 0,
        filters: [
            // { fieldName: "ToStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            // { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            // { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            // { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            // { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ]
      }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    


    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPatientwiseMaterialconsumptionComponent,
            {
               maxHeight: '95vh',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    StoreId = 0
    selectChangestore(obj: any) {
        console.log(obj);
        this.StoreId = obj.value
    }

    EditConsumption(row:any=null) { 
        let that = this;
        const dialogRef = this._matDialog.open(NewPatientwiseMaterialconsumptionComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
