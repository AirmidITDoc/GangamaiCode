import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CanteenRequestService } from './canteen-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NewCanteenRequestComponent } from './new-canteen-request/new-canteen-request.component';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FormBuilder, FormGroup } from '@angular/forms';



@Component({
    selector: 'app-canteen-request',
    templateUrl: './canteen-request.component.html',
    styleUrls: ['./canteen-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CanteenRequestComponent implements OnInit {
    myFilterform


    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
@ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        // this.gridConfig.columnsList.find(col => col.key === 'admId')!.template = this.Status;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    gridConfig: gridModel = {
        apiUrl: "CanteenRequest/CanteenRequestHeaderList",
        columnsList: [
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Visit/AdmDate", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA',type:8 },
            { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddUserName", key: "addedUserName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsBillGenerated", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
        ],
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals }
        ]
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;

    GetDetails(data) {
        let reqId=data.reqId
        this.gridConfig1 = {
        apiUrl: "CanteenRequest/CanteenRequestList",
        columnsList: [
            // { heading: "Code", key: "reqId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
        ],
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "ReqId", fieldValue: "1", opType: OperatorComparer.Equals }
           
        ]
      }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    
    constructor(public _CanteenRequestService: CanteenRequestService, public _matDialog: MatDialog, private _formBuilder: FormBuilder,
        public toastr: ToastrService,) { }
    ngOnInit(): void {
        this.myFilterform=this.filterForm()
    }

  
     filterForm(): FormGroup {
            return this._formBuilder.group({
                RegNo: '',
               
                fromDate: [(new Date()).toISOString()],
                enddate: [(new Date()).toISOString()],
            });
        }


    onPrint(){}

    NewRequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCanteenRequestComponent,
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
            console.log('The dialog was closed - Action', result);
        });
    }
}


export class CanteenList {
    IndentNo: Number;
    IndentDate: number;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: number;
    IsInchargeVerify: string;
    CanteenList: any;
    FromStoreId: boolean;
  
    /**
     * Constructor
     *
     * @param CanteenList
     */
    constructor(CanteenList) {
      {
        this.IndentNo = CanteenList.IndentNo || 0;
        this.IndentDate = CanteenList.IndentDate || 0;
        this.FromStoreName = CanteenList.FromStoreName || "";
        this.ToStoreName = CanteenList.ToStoreName || "";
        this.Addedby = CanteenList.Addedby || 0;
        this.IsInchargeVerify = CanteenList.IsInchargeVerify || "";
        this.CanteenList = CanteenList.CanteenList || "";
        this.FromStoreId = CanteenList.FromStoreId || "";
  
      }
    }
  }
  export class CanteenDetList {
  
    ItemName: string;
    Qty: number;
    IssQty: number;
    BalQty: any;
    StoreName: any;
    /**
     * Constructor
     *
     * @param CanteenDetList
     */
    constructor(CanteenDetList) {
      {
  
        this.ItemName = CanteenDetList.ItemName || "";
        this.Qty = CanteenDetList.Qty || 0;
        this.IssQty = CanteenDetList.IssQty || 0;
        this.BalQty = CanteenDetList.BalQty || 0;
        this.StoreName = CanteenDetList.StoreName || '';
      }
    }
  }