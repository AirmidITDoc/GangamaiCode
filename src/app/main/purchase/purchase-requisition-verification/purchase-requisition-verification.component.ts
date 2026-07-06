import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PurchaseRequisitionlistComponent } from '../purchase-order/new-purchaseorder/purchase-requisitionlist/purchase-requisitionlist.component';
import { NewPurchaserequisitionComponent } from './new-purchaserequisition/new-purchaserequisition.component';
import { PurchaseRequisitionVerificationService } from './purchase-requisition-verification.service';


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
    FromStore: any = String(this.accountService.currentUserValue.user.storeId);
    Tostore: any = "0"
    IsVerify = "0"
    status = "0"
    IsClosed = "0"
    autocompletestore: string = "Store";
    PurchaseReqVerifyForm: FormGroup;
    PurchaseRequisitionId = "0"
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('detailactionsTemplate') detailactionsTemplate!: TemplateRef<any>;
    @ViewChild('isverifyTemplate') isverifyTemplate!: TemplateRef<any>
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isclosed')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'priority')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'isverify')!.template = this.isverifyTemplate;


    }

    allColumns2 = [
        { heading: "Status", key: "isclosed", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Priority", key: "priority", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Is Verify", key: "isverify", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

        { heading: "No", key: "purchaseRequisitionNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Date", key: "purchaseRequisitionTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
        { heading: "From Store", key: "fromStore", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "To Store", key: "toStore", sort: true, align: 'left', emptySign: 'NA', width: 200 },


        // { heading: "IsIncVerify", key: "isInchargeVerify", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Verify By", key: "isInchargeVerifyName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Verify Date", key: "isInchargeVerifyDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },


        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        {
            heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }

    ]

    allFilters2 = [{ fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },

    { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
    { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
    { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
    { fieldName: "IsClosed", fieldValue: this.IsClosed, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "PurchaseRequisition/PurchaseRequisitionHeaderList",
        columnsList: this.allColumns2,
        sortField: "PurchaseRequisitionId",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
            { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
            { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
            { fieldName: "IsClosed", fieldValue: this.IsClosed, opType: OperatorComparer.Equals }]
    }
    constructor(public _PurchasereqVerifyService: PurchaseRequisitionVerificationService, public _matDialog: MatDialog,
        public toastr: ToastrService, private accountService: AuthenticationService,
        private commonService: PrintserviceService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.PurchaseReqVerifyForm = this._PurchasereqVerifyService.SearchFilterForm();
        // this.PurchaseReqVerifyForm.get('FromStoreId').setValue(this.accountService.currentUserValue.user.storeId);
    }



    onChangeFirst() {

        if (this.PurchaseReqVerifyForm.get('Verify').value == true) {
            this.IsVerify = "1"
        } else {
            this.IsVerify = "0"
        }

        if (this.PurchaseReqVerifyForm.get('Closed').value == true) {
            this.IsClosed = "1"
        } else {
            this.IsClosed = "0"
        }
        debugger
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.PurchaseReqVerifyForm.get('startdate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.PurchaseReqVerifyForm.get('enddate').value, "yyyy-MM-dd")
        this.FromStore = this.PurchaseReqVerifyForm.get("FromStoreId").value || this.FromStore
        this.Tostore = this.PurchaseReqVerifyForm.get("ToStoreId").value || this.Tostore
        this.getfilterdata();
    } 
    getfilterdata() {
        this.gridConfig = {
            apiUrl: "PurchaseRequisition/PurchaseRequisitionHeaderList",
            columnsList: this.allColumns2,
            sortField: "PurchaseRequisitionId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
                { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
                { fieldName: "IsClosed", fieldValue: this.IsClosed, opType: OperatorComparer.Equals }]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    fromStoreView(value) {
        if (value.value !== 0)
            this.FromStore = value.value
        else
            this.FromStore = "0"
        this.onChangeFirst();
    }

    toStoreView(value) {
        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"
        this.onChangeFirst();
    }

    GetDetails2(data) {
        // debugger
        this.gridConfig1 = {
            apiUrl: "PurchaseRequisition/PurchaseRequisitionDetailList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "Bal Qty", key: "balqty", sort: true, align: 'left', emptySign: 'NA' },
            ],
            sortField: "PurchaseRequisitionId",
            sortOrder: 0,
            filters: [
                { fieldName: "PurchaseRequisitionId", fieldValue: String(data.purchaseRequisitionId), opType: OperatorComparer.Equals }
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    getPurchaseRequisition() {
        const dialogRef = this._matDialog.open(PurchaseRequisitionlistComponent,
            {
                maxWidth: "100%",
                height: '90%',
                width: '95%'
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }


    onSave(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(NewPurchaserequisitionComponent,
            {
                maxWidth: "90vw",
                height: '85%',
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

        const dialogRef = this._matDialog.open(NewPurchaserequisitionComponent,
            {
                maxWidth: "90vw",
                height: '650px',
                width: '90%',
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

    deleterequisition(row) {
        debugger
        Swal.fire({
            title: 'Do you want to cancel the Requisition?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const data = {
                    "purchaseRequisitionId": row.purchaseRequisitionId,
                    "isCancelledBy": this.accountService.currentUserValue.userId
                }
                this._PurchasereqVerifyService.RequisiionCancle(data).subscribe((response: any) => {
                    // this.grid.bindGridData();
                });
            }
        });
    }
    onVerify(row) {
        debugger
        const submitData = {
            "purchaseRequisitionId": row.purchaseRequisitionId,
            "isInchargeVerifyId": this.accountService.currentUserValue.userId

        };
        this._PurchasereqVerifyService.getVerifyRequisiion(submitData).subscribe(response => {
            // this.commonService.Onprint("PurchaseRequisitionId", row.purchaseRequisitionId, "IndentwiseReport");
            this.onChangeFirst();

        });
    }


    viewgetReportPdf(contact) {
        this.commonService.Onprint("PurchaseRequisitionId", contact.purchaseRequisitionId, "IndentwiseReport");
    }

    // viewgetIndentVerifyReportPdf(contact) {
    //   this.commonService.Onprint("IndentId", contact, "IndentWiseReport");
    // }
}
