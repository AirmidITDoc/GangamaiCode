import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { GoodReceiptnoteService } from '../good-receiptnote.service';

@Component({
    selector: 'app-poto-grn',
    templateUrl: './poto-grn.component.html',
    styleUrls: ['./poto-grn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class POtoGRNComponent implements OnInit {

    PotoGRNForm: FormGroup;
    autocompletestore: string = "Store";
    autocompleteSupplier: string = "SupplierMaster";
    SelectedObj: any = '';
    chargelist: any = [];
    Patientlist: any = [];
    FormDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    ToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    IsStatus: any = 0;
    StoreId: any = 0;
    SupplierId: any = 0;

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateType') actionButtonTemplateType!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically 
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'Status')!.template = this.actionButtonTemplateType;
    }
    AllColumns = [
        {
            heading: "Status", key: "Status", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionButtonTemplateType, width: 80
        },
        { heading: "Date", key: "purchaseDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
        { heading: "Grand Total Amt", key: "grandTotal", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },
        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    AllColumnsDetails = [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250, sticky: true },
        { heading: "UMO", key: "unitofMeasurementName", sort: true, align: 'left', emptySign: 'NA', width: 100, sticky: true },
        { heading: "HsNcode", key: "hsNcode", sort: true, align: 'left', emptySign: 'NA', width: 110, sticky: true },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "MRP", key: "mrp", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Rate", key: "rate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Total Amt", key: "grossAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "GST Per", key: "vatPer", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "vatAmount", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', width: 90, type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "itemDiscAmount", sort: true, align: 'left', emptySign: 'NA', width: 90, type: gridColumnTypes.amount },
        { heading: "Landed Rate", key: "landedRate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Grand Total Amt", key: "grandTotalAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "PO Qty", key: "poQty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "PO No", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "cgst per", key: "cgstper", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "sgst per", key: "sgstper", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "igst per", key: "igstper", sort: true, align: 'left', emptySign: 'NA', width: 90 }
    ]
    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;

    gridConfig: gridModel = {
        apiUrl: "GRN/Poheaderlist",
        columnsList: this.AllColumns,
        sortField: "SupplierId",
        sortOrder: 0,
        filters: [
            { fieldName: "SupplierId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
            { fieldName: "Status", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }

    constructor(
        public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _loggedService: AuthenticationService,
        public toastr: ToastrService,
        public _formBuilder: FormBuilder,
        public _dialogRef: MatDialogRef<POtoGRNComponent>,
    ) { }

    ngOnInit(): void {
        this.PotoGRNForm = this.CreatePotoGRNForm();
        this.ChangeeFilter();
    }
    CreatePotoGRNForm() {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            StoreId: [this._loggedService.currentUserValue.user.storeId],
            StatusType: [false],
            SupplierId: [0]
        });
    }
    ChangeeFilter() {
        this.isShowDetailTable = false;
        this.SupplierId = this.PotoGRNForm.get('SupplierId')?.value || 0
        this.FormDate = this.datePipe.transform(this.PotoGRNForm.get('start').value, 'yyyy-MM-dd')
        this.ToDate = this.datePipe.transform(this.PotoGRNForm.get('end').value, 'yyyy-MM-dd')
        this.IsStatus = this.PotoGRNForm.get('StatusType')?.value ? 1 : 0;
        this.StoreId = this.PotoGRNForm.get('StoreId')?.value || 0
        this.getHeaderlist();
    }
    selectChangeStore(value) {
        if (value?.value !== 0)
            this.StoreId = value.value
        else
            this.StoreId = "0"

        this.ChangeeFilter();
    }
    selectChangeSupplier(value) {
        if (value?.value !== 0)
            this.SupplierId = value.value
        else
            this.SupplierId = "0"

        this.ChangeeFilter();
    }
    getHeaderlist() {
        this.gridConfig = {
            apiUrl: "GRN/Poheaderlist",
            columnsList: this.AllColumns,
            sortField: "SupplierId",
            sortOrder: 0,
            filters: [
                { fieldName: "SupplierId", fieldValue: String(this.SupplierId), opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: String(this.FormDate), opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: String(this.ToDate), opType: OperatorComparer.Equals },
                { fieldName: "Status", fieldValue: String(this.IsStatus), opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals },
            ]
        }
        //this.grid.bindGridData();
    }
    getSelectedRow(Obj) {
        this.SelectedObj = Obj
        this.isShowDetailTable = true;
        this.gridConfig1 = {
            apiUrl: "GRN/Podetaillist",
            columnsList: this.AllColumnsDetails,
            sortField: "PurchaseID",
            sortOrder: 0,
            filters: [
                { fieldName: "PurchaseID", fieldValue: String(Obj?.purchaseId ?? 0), opType: OperatorComparer.Equals }
            ]
        }
        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        }, 1000);

    }
    OnSavedata() {
        const PurchaseId = this.SelectedObj?.purchaseId || 0
        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "PurchaseID",
            "sortOrder": 0,
            "filters": [{ "fieldName": "PurchaseID", "fieldValue": String(PurchaseId), "opType": "Equals" }],
            "columns": [{ "data": "string", "name": "string" }],
            "exportType": "JSON"
        }
        this._GRNList.getPurchasedetailList(vdata).subscribe(response => {
            this.chargelist = response.data
            if (this.chargelist?.length) {
                this.getSave();
            } else {
                this.toastr.warning('Product not in list Please select Product!', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return
            }
        })
    }
    getSave() {
        debugger
        console.log(this.chargelist)
        this.chargelist.forEach((element) => {
            const FinalTotalQty = (element.qty * element?.conversionFactor);
            const FinalpurUnitRate = (((element?.itemTotalAmount || 0) / (element.qty)) * (element.conversionFactor))
            const FinalpurUnitrateWF = (((element?.itemTotalAmount || 0) / (FinalTotalQty)) * (element?.conversionFactor))
            const FinalUnitMRP = ((element?.mrp || 0) / (element?.conversionFactor)) || 0

            this.Patientlist.push(
                {
                    ItemId: element.itemId ?? 0,
                    ItemName: element.itemName?.trim() || '',
                    ConversionFactor: Number(element.conversionFactor) || 1,
                    UOMId: element.uomid ?? 0,
                    HSNCode: element.hsNcode?.trim() || 'N/A',
                    BatchNo: '',
                    ExpDate: element.expDate || '1999-01-01',
                    Qty: Number(element.qty) || 0,
                    FreeQty: 0,
                    TotalQty: Number(FinalTotalQty) || 0,
                    MRP: Number(element.mrp) || 0,
                    Rate: Number(element.rate) || 0,
                    TotalAmount: Number(element.itemTotalAmount) || 0,
                    Disc: Number(element.discPer) || 0,
                    DisAmount: Number(element.itemDiscAmount) || 0,
                    Disc2: 0,
                    DiscAmt2: 0,
                    GST: Number(element.vatPer) || 0,
                    GSTAmount: Number(element.vatAmount) || 0,
                    CGST: Number(element.cgstper) || 0,
                    CGSTAmount: Number(element.cgstamt) || 0,
                    SGST: Number(element.sgstper) || 0,
                    SGSTAmount: Number(element.sgstamt) || 0,
                    IGST: Number(element.igstper) || 0,
                    IGSTAmount: Number(element.igstamt) || 0,
                    NetAmount: Number(element.grossAmount) || 0,
                    PurchaseId: element.purchaseId ?? 0,
                    PurDetId: element.purDetId ?? 0,
                    POBalQty: Number(element.poBalQty) || 0,
                    POQty: Number(element.poQty) || 0,
                    LandedRate: Number(element.landedRate) || 0,
                    purUnitRate: Number(FinalpurUnitRate) || 0,
                    PurUnitRateWF: Number(FinalpurUnitrateWF) || 0,
                    unitMRP: Number(FinalUnitMRP) || 0,
                    IsVerifiedUserId: 0,
                    IsVerified: false,
                    IsVerifiedDatetime: '1999-01-01',
                    StkID: 0,
                    grnDetID: 0,
                    supplierId: element.supplierId ?? 0,
                    transportChanges: Number(element.transportChanges) || 0,
                    handlingCharges: Number(element.handlingCharges) || 0,
                    freightCharges: Number(element.freightCharges) || 0,
                    octriAmount: Number(element.octriAmount) || 0,
                    supplierName: element.supplierName?.trim() || '',
                    PurchaseNo: element.purchaseNo || 0
                }
            );
        });
        console.log(this.Patientlist);
        if (this.Patientlist) {
            this._dialogRef.close(this.Patientlist);
        }

    }
    onClose() {
        this.PotoGRNForm.reset();
        this._dialogRef.close();
    }
    getValidationMessages() {
        return {
            supplierId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            StoreId: [
                // { name: "required", Message: "SupplierId is required" }
            ]
        };
    }
}
export class PODetailList {
    PurchaseId: any;
    ItemName: string;
    Qty: number;
    Rate: number;
    DiscPer: number;
    DiscAmount: number;
    VatPer: number;
    VatAmount: number;
    TotalAmount: number;
    MRP: number;
    GrandTotalAmount: number;

    constructor(PODetailList) {
        this.PurchaseId = PODetailList.PurchaseId || 0;
        this.ItemName = PODetailList.ItemName || "";
        this.Qty = PODetailList.Qty || 0;
        this.Rate = PODetailList.Rate || 0;
        this.DiscPer = PODetailList.DiscPer || 0;
        this.DiscAmount = PODetailList.DiscAmount || 0;
        this.VatPer = PODetailList.VatPer || 0;
        this.VatAmount = PODetailList.VatAmount || 0;
        this.TotalAmount = PODetailList.TotalAmount || 0;
        this.MRP = PODetailList.MRP || 0;
        this.GrandTotalAmount = PODetailList.GrandTotalAmount || 0;
    }
}
export class POList {
    PurchaseDate: any;
    SupplierName: string;
    PurchaseNo: number;
    TotalAmount: number;
    GrandTotal: number;
    /**
     * Constructor
     *
     * @param POList
     */
    constructor(POList) {
        {

            this.PurchaseDate = POList.PurchaseDate || 0;
            this.SupplierName = POList.SupplierName || "";
            this.PurchaseNo = POList.PurchaseNo || 0;
            this.TotalAmount = POList.TotalAmount || 0;
            this.GrandTotal = POList.GrandTotal || 0;
        }
    }
}

