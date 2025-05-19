import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from './good-receiptnote.service'; 
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2'; 
import { ToastrService } from 'ngx-toastr'; 
import { QrcodegeneratorComponent } from 'app/main/purchase/good-receiptnote/qrcodegenerator/qrcodegenerator.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import * as XLSX from 'xlsx'; 
import { NewGrnComponent } from './new-grn/new-grn.component';
import { GSTType } from './new-grn/types';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-good-receiptnote',
    templateUrl: './good-receiptnote.component.html',
    styleUrls: ['./good-receiptnote.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class GoodReceiptnoteComponent implements OnInit {
    reportPrintObjList:any=[]
    finalamt:any=0;
    screenFromString = 'admission-form';
    isChecked: boolean = true;
    labelPosition: 'before' | 'after' = 'after';
    chkNewGRN: any;
    SpinLoading: boolean = false;
    Filepath: any;
    currentDate = new Date();
    IsLoading: boolean = false;

    fromDate: any = "";
    toDate: any = "";
    StoreId: any = "0";
    SupplierId: any = "0";
    IsVerify: any;

    autocompletestore: string = "Store";
    autocompleteSupplier: string = "SupplierMaster";
    FromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    StoreId1 = this._GRNService.GRNSearchGroup.get('ToStoreId').value || 0;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateStatus') actionButtonTemplateStatus!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateCheck') actionButtonTemplateCheck!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'Status')!.template = this.actionButtonTemplateStatus;
       
    }
    AllColumns = [
        {
            heading: "Status", key: "Status", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        },
        { heading: "Date", key: "grndate", sort: true, align: 'left', emptySign: 'NA', width: 130, },
        { heading: "GRN No", key: "grnNumber", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Invoice No", key: "invoiceNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "totalDiscAmount", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
        { heading: "GST Amt", key: "totalVatamount", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "Rounding Amt", key: "roundingAmt", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
        { heading: "Debit Note", key: "debitNote", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Credit Note", key: "creditNote", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Received By", key: "receivedBy", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "IsClosed", key: "isClosed", sort: true, align: 'left', emptySign: 'NA', width: 100, },
        {
            heading: "Action", key: "action", align: "right", width: 160, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    AllDetailsColumns = [
        //   { heading: "-", key: "check", sort: false, align: 'left', emptySign: 'NA',width:60,type: gridColumnTypes.template,
        //     template: this.actionButtonTemplateCheck},
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "BatchExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Package", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "R Qty", key: "receiveQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Free Qty", key: "freeQty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "MRP", key: "mrp", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Rate", key: "rate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "GST Amt", key: "vatPercentage", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "discPercentage", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Landed Rate", key: "landedRate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Total Qty", key: "totalQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "StockId", key: "stockid", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Verified", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', width: 100, },
        { heading: "VerifiedDatetime", key: "isVerifiedDatetime", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 9 }
    ]
    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    gridConfig: gridModel = {
        apiUrl: "GRN/GRNHeaderList",
        columnsList: this.AllColumns,
        sortField: "GRNID",
        sortOrder: 0,
        filters: [
            { fieldName: "ToStoreId", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.FromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.ToDate, opType: OperatorComparer.Equals },
            { fieldName: "IsVerify", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Supplier_Id", fieldValue: "0", opType: OperatorComparer.Equals }
        ],
    } 

    constructor(
        public _GRNService: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        private commonService: PrintserviceService,

    ) { }

    ngOnInit(): void {
        this._GRNService.GRNSearchGroup.get('ToStoreId').setValue(this.accountService.currentUserValue.user.storeId)
    }

    getSelectedRow(event) { 
        console.log(event)
        this.isShowDetailTable = true;
        this.gridConfig1 = {
            apiUrl: "GRN/GRNDetailsList",
            columnsList: this.AllDetailsColumns,
            sortField: "GRNDetID",
            sortOrder: 0,
            filters: [
                { fieldName: "GrnId", fieldValue: String(event.grnid), opType: OperatorComparer.Equals }
            ],
        }
 
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }
    getValidationMessages() {
        return {
            supplierId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            ToStoreId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            itemName: [
                // { name: "required", Message: "Item Name is required" }
            ],
            batchNo: [
                // { name: "required", Message: "Batch No is required" }
            ],
            invoiceNo: [
                // { name: "required", Message: "Invoice No is required" }
            ]

        };
    } 

    onChangeFirst() {
        this.isShowDetailTable = false;
        if (this._GRNService.GRNSearchGroup.get('Status1').value == true) {
            this.IsVerify = "1"
        } else {
            this.IsVerify = "0"
        }
        this.fromDate = this.datePipe.transform(this._GRNService.GRNSearchGroup.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this._GRNService.GRNSearchGroup.get('end').value, "yyyy-MM-dd")
        this.getfilterdata();
    } 
    getfilterdata() {
        this.gridConfig = {
            apiUrl: "GRN/GRNHeaderList",
            columnsList: this.AllColumns,
            sortField: "GRNID",
            sortOrder: 0,
            filters: [
                { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsVerify", fieldValue: this.IsVerify, opType: OperatorComparer.Equals },
                { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
            ],
        }  
    }
    selectChangeStore(value) {
        if (value.value !== 0)
            this.StoreId = value.value
        else
            this.StoreId = "0"

        this.onChangeFirst();
    }
    selectChangeSupplier(value) {
        if (value.value !== 0)
            this.SupplierId = value.value
        else
            this.SupplierId = "0"

        this.onChangeFirst();
    }
    data: any[];
    FullData: GRNList = {} as GRNList;
    selection = new SelectionModel<GrnItemList>(true, []);

    onFileChange(evt: any) {
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            this.data = <any[]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            console.log(this.data);
            let INetAmt = 0, SgstPer = 0, SgstAmt = 0, CgstPer = 0, CgstAmt = 0;
            for (let i = 1; i < this.data.length; i++) {
                INetAmt += parseFloat(this.data[i][this.data[0].indexOf('INetAmt')] || 0);
                SgstPer += parseFloat(this.data[i][this.data[0].indexOf('SGSTAmt')] || 0);
                SgstAmt += parseFloat(this.data[i][this.data[0].indexOf('SGSTPer')] || 0);
                CgstAmt += parseFloat(this.data[i][this.data[0].indexOf('CGSTAmt')] || 0);
                CgstPer += parseFloat(this.data[i][this.data[0].indexOf('CGSTPer')] || 0);
            }
            this.FullData = {
                GrnNumber: this.data[1][this.data[0].indexOf('InvNo')],
                GRNDate: this.data[1][this.data[0].indexOf('InvDate')],
                GRNTime: null,
                InvoiceNo: this.data[1][this.data[0].indexOf('InvNo')],
                SupplierName: this.data[1][this.data[0].indexOf('Vendor')],
                TotalAmount: 0,
                TotalDiscAmount: 0,
                TotalVATAmount: 0,
                NetAmount: INetAmt,
                RoundingAmt: 0,
                DebitNote: '',
                CreditNote: this.data[1][this.data[0].indexOf('CNote')],
                InvDate: this.data[1][this.data[0].indexOf('InvDate')],
                Cash_CreditType: '',
                ReceivedBy: '',
                IsClosed: false,
                GSTNo: this.data[1][this.data[0].indexOf('VGSTIN')],
                Remark: '',
                Mobile: '',
                Address: '',
                Email: '',
                Phone: '',
                PONo: '',
                EwayBillNo: this.data[1][this.data[0].indexOf('EWBN')],
                EwayBillDate: '',
                OtherCharge: '',
                Rate: 0,
                CGSTPer: CgstPer,
                SGSTPer: SgstPer,
                CGSTAmt: CgstAmt,
                SGSTAmt: CgstPer,
                NetPayble: 0,
                AddedByName: '',
                GrandTotalAount: 0,
                TotCGSTAmt: 0,
                TotSGSTAmt: 0,

                Items: [] as ItemNameList[]
            } as unknown as GRNList;
            for (let i = 1; i < this.data.length; i++) {
                // list here item details map...
                this.FullData["Items"].push({
                    ItemName: this.data[i][this.data[0].indexOf('ProductDesc')],
                    BatchNo: this.data[i][this.data[0].indexOf('BatchNo')],
                    ExpDate: this.data[i][this.data[0].indexOf('ExpDate')],
                    Qty: this.data[i][this.data[0].indexOf('Qty')],
                    FreeQty: this.data[i][this.data[0].indexOf('Free')],
                    Rate: this.data[i][this.data[0].indexOf('Rate')],
                    MRP: this.data[i][this.data[0].indexOf('MRP')],
                    CGSTPer: this.data[i][this.data[0].indexOf('CSTPer')],
                    VatPer: this.data[i][this.data[0].indexOf('VATPer')],
                    NetAmount: this.data[i][this.data[0].indexOf('INetAmt')],
                } as ItemNameList);
            }
            this.newGRNEntry(3);
        };

        reader.readAsBinaryString(target.files[0]);
    }

    newGRNEntry(chkNewGRN) {
        const dialogRef = this._matDialog.open(NewGrnComponent,
            {
                maxWidth: "100%",
                height: '98%',
                width: '98%',
                data: {
                    chkNewGRN: chkNewGRN,
                    FullData: this.FullData
                }
            });
        dialogRef.afterClosed().subscribe(result => {
              this.grid.bindGridData();
        }); 
        
    }
    GRNEmail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact
                }
            });
        dialogRef.afterClosed().subscribe(result => {
              this.grid.bindGridData(); 
        }); 
     
    }
    onEdit(contact) {
        this.chkNewGRN = 2;
        console.log(contact)
        const dialogRef = this._matDialog.open(NewGrnComponent,
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
               this.grid.bindGridData();
        });
       
    }
    onVerify(row) {
        let GRNVerifyObj = {};
        GRNVerifyObj['grnid'] = row.grnid;
        GRNVerifyObj['isVerifiedUserId'] = this.accountService.currentUserValue.userId;

        this._GRNService.getVerifyGRN(GRNVerifyObj).subscribe(response => {
        }); 
        // this.onChangeFirst();
         this.grid.bindGridData();
    }
    LastThreeItemList(contact) {
        var vdata = {
            'ItemId': contact.ItemId,
        }
        // this._GRNService.getLastThreeItemInfo(vdata).subscribe(data => {
        //     this.dsLastThreeItemList.data = data as LastThreeItemList[];  
        // });
    }
    getWhatsappshareSales(el) {
        var m_data = {
            "insertWhatsappsmsInfo": {
                "mobileNumber": 22,//el.RegNo,
                "smsString": "Dear" + el.PatientName + ",Your GRN has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
                "isSent": 0,
                "smsType": 'GRN',
                "smsFlag": 0,
                "smsDate": this.currentDate,
                "tranNo": el.GRNID,
                "PatientType": 2,//el.PatientType,
                "templateId": 0,
                "smSurl": "info@gmail.com",
                "filePath": this.Filepath || '',
                "smsOutGoingID": 0

            }
        }
        this._GRNService.InsertWhatsappGRN(m_data).subscribe(response => {
            if (response) {
                Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
                    if (result.isConfirmed) {
                        this._matDialog.closeAll();
                    }
                });
            } else {
                Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
            }

        });
        this.IsLoading = false;
        el.button.disable = false;
    }
    openQrCodePrintDialog(row) {
        setTimeout(() => {
            this.SpinLoading = true;
            const dialogRef = this._matDialog.open(QrcodegeneratorComponent,
                {
                    data: {
                        QrCodeData: row.stockid,
                        Qty: row.ReceiveQty,
                        title: "Grn QR"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
        }, 100);
    }

    printBulkQrCode() {
        setTimeout(() => {
            this.SpinLoading = true;
            let data = [];
            this.selection.selected.forEach(element => {
                data.push({ QrCodeData: element["stockid"].toString(), Qty: element.ReceiveQty, Width: 15, Margin: 2, Between: 3 });
            });
            console.log(data)
            const dialogRef = this._matDialog.open(QrcodegeneratorComponent,
                {
                    data: {
                        QrData: data,
                        title: "Grn QR"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
            dialogRef.afterClosed().subscribe(result => {
                // this.AdList=false;
                this.SpinLoading = false;
            });
        }, 100);
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        // const numRows = this.dsGrnItemList.data.length;
        // return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        // if there is a selection then clear that selection
        if (this.isSomeSelected()) {
            this.selection.clear();
        } else {
            // this.isAllSelected()
            //     ? this.selection.clear()
            //     : this.dsGrnItemList.data.forEach(row => this.selection.select(row));
        }
    }

    isSomeSelected() {
        // console.log(this.selection.selected);
        return this.selection.selected.length > 0;
    }

    // delete(elm) {
    //     this.dsItemNameList.data = this.dsItemNameList.data
    //         .filter(i => i !== elm)
    //         .map((i, idx) => (i.position = (idx + 1), i));
    // }
    viewgetGRNReportPdf(data) { 
        this.commonService.Onprint("GRNID", data.grnid, "Good Receipt Note");
      }
}

export class GRNList {
    GrnNumber: number;
    GRNDate: number;
    GRNTime: any;
    InvoiceNo: number;
    SupplierName: string;
    TotalAmount: any;
    TotalDiscAmount: any;
    TotalVATAmount: any;
    NetAmount: any;
    RoundingAmt: number;
    DebitNote: number;
    CreditNote: number;
    InvDate: number;
    Cash_CreditType: string;
    ReceivedBy: any;
    IsClosed: any;
    GSTNo: any;
    Remark: any;
    Mobile: any;
    Address: any;
    Email: any;
    Phone: any;
    PONo: any;
    EwayBillNo: any;
    EwayBillDate: Date;
    OtherCharge: any;
    Rate: any;
    CGSTPer: any;
    SGSTPer: any;
    CGSTAmt: any;
    SGSTAmt: any;
    NetPayble: any
    AddedByName: any;
    GrandTotalAount: any;
    TotCGSTAmt: any;
    TotSGSTAmt: any;

    /**
     * Constructor
     *
     * @param GRNList
     */
    constructor(GRNList) {
        {
            this.GrnNumber = GRNList.GrnNumber || 0;
            this.GRNDate = GRNList.GRNDate || 0;
            this.GRNTime = GRNList.GRNTime || '';
            this.InvoiceNo = GRNList.InvoiceNo || 0;
            this.SupplierName = GRNList.SupplierName || "";
            this.TotalAmount = GRNList.TotalAmount || 0;
            this.TotalDiscAmount = GRNList.TotalDiscAmount || 0;
            this.TotalVATAmount = GRNList.TotalVATAmount || 0;
            this.NetPayble = GRNList.NetPayble || 0;
            this.NetAmount = GRNList.NetAmount || 0;
            this.RoundingAmt = GRNList.RoundingAmt || 0;
            this.DebitNote = GRNList.DebitNote || 0;
            this.CreditNote = GRNList.CreditNote || 0;
            this.InvDate = GRNList.InvDate || 0;
            this.Cash_CreditType = GRNList.Cash_CreditType || "";
            this.ReceivedBy = GRNList.ReceivedBy || 0;
            this.IsClosed = GRNList.IsClosed || 0;
            this.GSTNo = GRNList.GSTNo || 0;
            this.Remark = GRNList.Remark || "";
            this.TotSGSTAmt = GRNList.TotSGSTAmt || 0;
            this.TotCGSTAmt = GRNList.TotCGSTAmt || 0;
        }
    }
}

export class GrnItemList {

    ItemID: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    ReceiveQty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    ConversionFactor: number;
    VatPercentage: number;
    DiscPercentage: number;
    LandedRate: number;
    NetAmount: number;
    TotalQty: number;

    /**
     * Constructor
     *
     * @param GrnItemList
     */
    constructor(GrnItemList) {
        {

            this.ItemID = GrnItemList.ItemID || 0;
            this.ItemName = GrnItemList.ItemName || "";
            this.BatchNo = GrnItemList.BatchNo || 0;
            this.BatchExpDate = GrnItemList.BatchExpDate || 0;
            this.ReceiveQty = GrnItemList.ReceiveQty || 0;
            this.FreeQty = GrnItemList.FreeQty || 0;
            this.MRP = GrnItemList.MRP || 0;
            this.Rate = GrnItemList.Rate || 0;
            this.TotalAmount = GrnItemList.TotalAmount || 0;
            this.ConversionFactor = GrnItemList.ConversionFactor || 0;
            this.VatPercentage = GrnItemList.VatPercentage || 0;
            this.DiscPercentage = GrnItemList.DiscPercentage || 0;
            this.LandedRate = GrnItemList.LandedRate || 0;
            this.NetAmount = GrnItemList.NetAmount || 0;
            this.TotalQty = GrnItemList.TotalQty || 0;

        }
    }
}

export class ItemNameList {
    // Action: string;

    ItemName: string;
    UOMId: number;
    HSNCode: number;
    BatchNo: number;
    ExpDate: string;
    Qty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    Disc: number;
    DisAmount: number;
    Disc2: number;
    DisAmount2: number;
    GSTNo: number;
    GST: number;
    GSTAmount: number;
    CGST: number;
    CGSTAmount: number;
    SGST: number;
    SGSTAmount: number;
    IGST: number;
    IGSTAmount: number;
    NetAmount: number;
    position: number;
    ItemID: any;
    ItemId: any;
    VatPer: any;
    VatAmt: any;
    MRP_Strip: any;
    grnid: any;
    GRNID: any;
    InvoiceNo: any;
    GateEntryNo: any;
    SupplierId: any;
    GrnNumber: any;
    OtherCharge: any;
    DebitNote: any;
    CreditNote: any;
    RoundingAmt: any;
    InvDate: Date;
    PaymentDate: Date;
    TotalDiscAmount: any;
    ReceivedBy: any;
    Remark: any;
    StoreId: any;
    totalVATAmount: any;
    ConversionFactor: any;
    ReceiveQty: any;
    CGSTAmt: number;
    CGSTPer: number;
    SGSTAmt: number;
    SGSTPer: number;
    IGSTPer: number;
    IGSTAmt: number;
    HSNcode: any;
    VatAmount: number;
    VatPercentage: number;
    id: number;
    ConstantId: number;
    discPercentage: number;
    discAmount: number;
    DiscPercentage: number;
    DiscPer2: number;
    DiscAmt2: number;
    PaymentType: any;
    GRNType: any;
    DateOfInvoice: any;
    EwayBillDate: Date;
    CurrentDate = new Date();
    Tranprocessmode: any;
    Cash_CreditType: any;
    tranProcessMode: any;
    EwayBillNo: any;
    TotalQty: any;
    UnitofMeasurementName: number;
    UnitofMeasurementId: any;
    POBalQty: any;
    PurchaseId: any;
    IsClosed: boolean;
    PurDetId: any;
    LandedRate: any;
    PurUnitRate: any;
    PurUnitRateWF: any;
    BatchExpDate: any;
    POQty: any;
    ItemDiscAmount: any;
    DiscPer: any;
    ItemTotalAmount: any;
    UOMID: any;
    GrandTotalAmount: any;
    TranProcessId: any;
    UnitMRP: any;
    IsVerified: any;
    IsVerifiedDatetime: any;
    IsVerifiedUserId: any;
    StkID: any;
    IsVerifiedId: any
    VerifiedDateTime: any;
    PurchaseID: any;
    PurchaseNo: any;
    SupplierName: any;
    SrNo: number;
    DebitAmount: any;
    GSTType: GSTType | null;

  cgst: number;
  sgst: number;
  igst: number;
  gst: number;
  finalTotalQty: number;

    itemId: any;
    itemName: any;
    uomId: any;
    unitofMeasurementName: any;
    receiveQty: any;
    freeQty: any;
    unitMRP: any;
    mrp: any;
    mrP_Strip: any;
    rate: any;
    conversionFactor: any;
    vatPercentage: any;
    vatAmount: any;
    totalQty: any;
    landedRate: any;
    poNo: any;
    grnDetID: any;
    batchNo: any;
    batchExpDate: any;
    purDetId: any;

    totalAmount: any;
    totalDiscAmount: any
    netAmount: any;
    totalVatamount: any;
    remark: any;
    receivedBy: any;
    debitNote: any;
    creditNote: any;
    otherCharge: any;
    roundingAmt: any;
    grnNumber: any;
    supplierId: any;
    supplierName: any
    storeId: any;
    grndate: any;
    grntime: any;
    invoiceNo: any;
    deliveryNo: any;
    gateEntryNo: any;
    grntype: any;
    isVerified: any;
    totSGSTAmt: any;
    totIGSTAmt: any;
    billDiscAmt: any;
    mobile: any;
    email: any;

    poQty: any;
    purchaseId: any;
    poBalQty: any;
    purUnitRate: any;
    purUnitRateWf: any;
    cgstper: any;
    cgstamt: any;
    sgstper: any;
    sgstamt: any;
    igstper: any;
    igstamt: any;
    hsncode: any;
    stkID: any;
    cash_CreditType: any;
    grnType: any;
    isVerifiedDatetime: any;
    isVerifiedUserId: any;
    discAmt2: any;
    /**
     * Constructor
     *
     * @param ItemNameList
     */
    constructor(ItemNameList) {
        {

            this.ItemName = ItemNameList.ItemName || "";
            this.UOMId = ItemNameList.UOMId || 0;
            this.HSNCode = ItemNameList.HSNCode || 0;
            this.BatchNo = ItemNameList.BatchNo || 0;
            this.ExpDate = ItemNameList.ExpDate || 0;
            this.Qty = ItemNameList.Qty || 0;
            this.FreeQty = ItemNameList.FreeQty || 0;
            this.MRP = ItemNameList.MRP || 0;
            this.Rate = ItemNameList.Rate || 0;
            this.TotalAmount = ItemNameList.TotalAmount || 0;
            this.Disc = ItemNameList.Disc || 0;
            this.Disc2 = ItemNameList.Disc2 || 0;
            this.DisAmount = ItemNameList.DisAmount || 0;
            this.DiscPer2 = ItemNameList.DiscPer2 || 0;
            this.DiscAmt2 = ItemNameList.DiscAmt2 || 0;
            this.GSTNo = ItemNameList.GSTNo || 0;
            this.GST = ItemNameList.GST || 0;
            this.GSTAmount = ItemNameList.GSTAmount || 0;
            this.CGST = ItemNameList.CGST || 0;
            this.CGSTAmount = ItemNameList.CGSTAmount || 0;
            this.SGST = ItemNameList.SGST || 0;
            this.SGSTAmount = ItemNameList.SGSTAmount || 0;
            this.IGST = ItemNameList.IGST || 0;
            this.poBalQty = ItemNameList.poBalQty || 0;
            this.IGSTAmount = ItemNameList.IGSTAmount || 0;
            this.DisAmount2 = ItemNameList.DisAmount2 || 0;
            this.NetAmount = ItemNameList.NetAmount || 0;
            this.ItemID = ItemNameList.ItemID || 0;
            this.ItemId = ItemNameList.ItemId || 0;
            this.VatPer = ItemNameList.VatPer || 0;
            this.VatAmt = ItemNameList.VatAmt || 0;
            this.MRP_Strip = ItemNameList.MRP_Strip || 0;
            this.grnid = ItemNameList.grnid || 0;
            this.GRNID = ItemNameList.GRNID || 0;
            this.InvoiceNo = ItemNameList.InvoiceNo || 0;
            this.GateEntryNo = ItemNameList.GateEntryNo || 0;
            this.SupplierId = ItemNameList.SupplierId || 0;
            this.GrnNumber = ItemNameList.GrnNumber || 0;
            this.OtherCharge = ItemNameList.OtherCharge || 0;
            this.DebitNote = ItemNameList.DebitNote || 0;
            this.CreditNote = ItemNameList.CreditNote || 0;
            this.RoundingAmt = ItemNameList.RoundingAmt || 0;
            this.InvDate = ItemNameList.InvDate || this.CurrentDate;;
            this.TotalDiscAmount = ItemNameList.TotalDiscAmount || 0;
            this.totalVATAmount = ItemNameList.totalVATAmount || 0;
            this.ReceivedBy = ItemNameList.ReceivedBy || ''
            this.Remark = ItemNameList.Remark || ''
            this.StoreId = ItemNameList.StoreId || 0;
            this.TotalQty = ItemNameList.TotalQty || 0;
            this.EwayBillNo = ItemNameList.EwayBillNo || 0;
            this.Tranprocessmode = ItemNameList.Tranprocessmode || "";
            this.EwayBillDate = ItemNameList.EwayBillDate || this.CurrentDate;
            this.PaymentDate = ItemNameList.PaymentDate || this.CurrentDate;
            this.DateOfInvoice = ItemNameList.DateOfInvoice || this.CurrentDate;
            this.LandedRate = ItemNameList.LandedRate || 0;
            this.PurUnitRate = ItemNameList.PurUnitRate || 0;
            this.PurUnitRateWF = ItemNameList.PurUnitRateWF || 0;
            this.BatchExpDate = ItemNameList.BatchExpDate || 0;
            this.PurchaseId = ItemNameList.PurchaseId || 0;
            this.ItemDiscAmount = ItemNameList.ItemDiscAmount || 0;
            this.DiscPer = ItemNameList.DiscPer || 0;
            this.ItemTotalAmount = ItemNameList.ItemTotalAmount || 0;
            this.UOMID = ItemNameList.UOMID || 0;
            this.GrandTotalAmount = ItemNameList.GrandTotalAmount || 0;
            this.UnitMRP = ItemNameList.UnitMRP || 0;
            this.IsVerified = ItemNameList.IsVerified || 0;
            this.IsVerifiedDatetime = ItemNameList.IsVerifiedDatetime || 0;
            this.IsVerifiedUserId = ItemNameList.IsVerifiedUserId || 0;
            this.StkID = ItemNameList.StkID || 0;
            this.IsVerifiedId = ItemNameList.IsVerifiedId || 0;
            this.VerifiedDateTime = ItemNameList.VerifiedDateTime || 0;
            this.ReceiveQty = ItemNameList.ReceiveQty || 0
            this.ConversionFactor = ItemNameList.ConversionFactor || 0
            this.SrNo = ItemNameList.SrNo || 0;
            this.PurchaseNo = ItemNameList.PurchaseNo || 0;
            this.GSTType = ItemNameList.GSTType || null;
            this.DebitAmount = ItemNameList.DebitAmount || 0
        }
    }
}
export class LastThreeItemList {
    ItemID: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    ReceiveQty: number;
    FreeQty: number;
    MRP: number;
    Rate: number;
    TotalAmount: number;
    ConversionFactor: number;
    VatPercentage: number;

    constructor(LastThreeItemList) {
        {

            this.ItemID = LastThreeItemList.ItemID || 0;
            this.ItemName = LastThreeItemList.ItemName || "";
            this.BatchNo = LastThreeItemList.BatchNo || 0;
            this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
            this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
            this.FreeQty = LastThreeItemList.FreeQty || 0;
            this.MRP = LastThreeItemList.MRP || 0;

        }
    }
}
