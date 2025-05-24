import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MaterialConsumptionService } from './material-consumption.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { NewMaterialConsumptionComponent } from './new-material-consumption/new-material-consumption.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-material-consumption',
    templateUrl: './material-consumption.component.html',
    styleUrls: ['./material-consumption.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaterialConsumptionComponent implements OnInit {
    hasSelectedContacts: boolean;
    myFilterform: FormGroup;
    autocompletestore: string = "Store";
    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    StoreId=this.accountService.currentUserValue.user.storeId
ngOnInit(): void {this.myFilterform = this._MaterialConsumptionService.createSearchFrom();}

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('Status') Status!: TemplateRef<any>;

 fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
 toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  ngAfterViewInit() {
         this.gridConfig.columnsList.find(col => col.key === 'admId')!.template = this.Status;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
     }
 allcolumns = [
    { heading: "-", key: "admId", sort: true, align: 'left', type: gridColumnTypes.template , width: 30},
    { heading: "DateTime", key: "consumptionTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 8 },
    { heading: "StoteName", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "LandedTotalAmount", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 50 },
    {
        heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        template: this.actionButtonTemplate  // Assign ng-template to the column
    }
     ]

    gridConfig: gridModel = {
       apiUrl: "MaterialConsumption/MaterialConsumptionList",
       columnsList: this.allcolumns,
       sortField: "MaterialConsumptionId",
       sortOrder: 0,
       filters: [{ fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
                    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                     { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
       ]
     }
   
    constructor(
        public _MaterialConsumptionService: MaterialConsumptionService, public _formBuilder: UntypedFormBuilder,
        public toastr: ToastrService, public _matDialog: MatDialog,public datePipe: DatePipe, private accountService: AuthenticationService,
    ) { }

    
  

    NewMatrialCon() {
        const dialogRef = this._matDialog.open(NewMaterialConsumptionComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '98%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.isShowDetailTable = false;
            this.grid.bindGridData();
        });
    }

    getSelectedRow(row: any): void {
        
        console.log("selectedRow:", row)
        let materialConsumptionId =row.materialConsumptionId//row.materialConsumptionId;
    
        this.gridConfig1 = {
            apiUrl: "MaterialConsumption/MaterialConsumptionDetailsList",
            columnsList: [
                 { heading: "ItemName", key: "itemName", sort: true, align: 'left',type: gridColumnTypes.template, width: 250 },
                 { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "BatchExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 100 , type: 8},
                 { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 50 },
                 { heading: "PerUnitPurchase", key: "perUnitPurchaseRate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "PerUnitLandedRate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "PerUnitMRPRate", key: "perUnitMRPRate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "PurTotalAmt", key: "purTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "LandedTotalAmt", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "MRPTotalAmt", key: "mrpTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "StartDate", key: "startDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 8 },
                 { heading: "EndDate", key: "endDate", sort: true, align: 'left', emptySign: 'NA', width: 150 , type: 8},
                 { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                 { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },
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
                columnsList:this.allcolumns,
                sortField: "MaterialConsumptionId",
                sortOrder: 0,
                filters: [
                    { fieldName: "ToStoreId", fieldValue:this.StoreId, opType: OperatorComparer.Equals },
                    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                     { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
                ],
                row: 25
            }
            console.log( this.gridConfig)
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
    
        }
    
    onPrint(data){}

    getValidationMessages() {
        return {
            ToStoreId: [
                //   { name: "required", Message: "Store Name is required" }
            ]
        };
    }
}
// export class MaterialConList {
//     ConsumptionNo: any;
//     Date: Number;
//     FromStoreName: string;
//     PurchaseTotalAmount: number;
//     TotalVatAmount: any;
//     Addedby: number;
//     Remark: any;

//     constructor(MaterialConList) {
//         {
//             this.ConsumptionNo = MaterialConList.ConsumptionNo || 0;
//             this.Date = MaterialConList.Date || 0;
//             this.PurchaseTotalAmount = MaterialConList.PurchaseTotalAmount || 0;
//             this.FromStoreName = MaterialConList.FromStoreName || "";
//             this.TotalVatAmount = MaterialConList.TotalVatAmount || 0;
//             this.Addedby = MaterialConList.Addedby || 0;
//             this.Remark = MaterialConList.Remark || "";

//         }
//     }
// }

