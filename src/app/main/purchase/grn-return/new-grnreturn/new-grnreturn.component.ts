import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ItemNameList } from '../grn-return.component';
import { GrnReturnService } from '../grn-return.service';
import { GrnListComponent } from './grn-list/grn-list.component';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
    selector: 'app-new-grnreturn',
    templateUrl: './new-grnreturn.component.html',
    styleUrls: ['./new-grnreturn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewGRNReturnComponent implements OnInit {
    displayedColumns3 = [
        // "checkbox",
        "ItemName",
        "BatchNo",
        "BatchExpDate",
        "ConversionFactor",
        "BalanceQty",
        'receiveQty',
        "ReturnQty",
        "MRP",
        //"Rate",
        "LandedRate",
        "TotalAmount",
        "GstPercentage",
        'GstAmount',
        "DiscPercentage",
        'DiscAmount',
        "NetAmount",
        "TotalQty",
        "stockid",
        "GRNID",
        'Action'
        // "IsVerified",
        // "IsVerifiedDatetime",
        // "IsVerifiedUserId"
    ];

    SpinLoading: boolean = false;
    ToStoreList: any = [];
    VReQty: number = 0;
    VsupplierName: any;
    SupplierList: any;
    optionsToStore: any;
    optionsSupplier: any;
    isPaymentSelected: boolean = false;
    isSupplierSelected: boolean = false;
    isChecked: boolean = true;
    chargeslist: any = [];
    dateTimeObj: any;
    screenFromString = 'GrnReturn-Form';
    labelPosition: 'before' | 'after' = 'after';
    sIsLoading: string;
    filteredoptionsToStore: Observable<string[]>;
    filteredoptionsSupplier: Observable<string[]>;
    vGRNReturnItemFilter: any;
    VsupplierId: any = 0
    vStoreId: any = this._loggedService.currentUserValue.user.storeId
    vFinalTotalAmount: any = 0
    vFinalNetAmount: any = 0
    vFinalVatAmount: any = 0
    vFinalDiscAmount: any = 0;
    vRoundingAmt: any;
    autocompletestore: string = "Store";
    autocompleteSupplier: string = "SupplierMaster"
    autocompleteModeGRNReturnTypes: string = "GRN_RETURN_TYPE";
    vGSTTpe = "GST Return";
    registerObj = new ItemNameList({});
    dsGrnItemList = new MatTableDataSource<ItemNameList>();
    dsNewGRNReturnItemList = new MatTableDataSource<ItemNameList>();
    dsItemNameList1 = new MatTableDataSource<ItemNameList>();
    CashCredittype: any;
    GrnReturnForm: FormGroup
    VGrnReturnID: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

    constructor(
        public _GRNReturnService: GrnReturnService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        public _formbuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }

    ngOnInit(): void {

        console.log("GRN Return:", this.data)
        if (this.data?.grnReturnId) {
            this.registerObj = this.data
            this.VsupplierId = this.data.supplierId
            this.vGRNID = this.data?.grnid
            this.VGrnReturnID = this.data?.grnReturnId

            if (this.registerObj.isGrnTypeFlag == true) {
                this.vGSTTpe = 'GST Return';
            } else {
                this.vGSTTpe = 'Without GST';
            }
            this._GRNReturnService.NewGRNReturnFrom.patchValue({ReturnType:this.data?.returnTypeId || 0})
             this.getGRNreturnlist();
        }
       
        // this.getStoreList();    
        this.GrnReturnForm = this.CreateGrnReturnInsertForm();
        this.grnReturnDetArray.push(this.createGrnReturnDetInsert());
        this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert());
        this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert());
    }

    CreateGrnReturnInsertForm() {
        let checkcashtype
        if (this.CashCredittype == false) {
            checkcashtype = false;
        } else {
            checkcashtype = true;
        }
        return this._formbuilder.group({
            grnReturn: this._formbuilder.group({

                "grnid": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "grnreturnDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "grnreturnTime": this.datePipe.transform(new Date(), 'shortTime'),
                "storeId": [Number(this._loggedService.currentUserValue.user.storeId), [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "supplierId": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "totalAmount": this.vFinalTotalAmount || 0,
                "grnReturnAmount": this.vFinalTotalAmount || 0,
                "totalDiscAmount": this.vFinalDiscAmount || 0,
                "totalVatAmount": this.vFinalVatAmount || 0,
                "totalOtherTaxAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalOctroiAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "netAmount": this.vFinalNetAmount || 0,
                "cashCredit": checkcashtype,
                "remark": [''],
                "isVerified": [false],
                "addedBy": this._loggedService.currentUserValue.userId,
                "isClosed": [false],
                "isCancelled": [false],
                "grnType": this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value,
                "isGrnTypeFlag": [true],
                "grnreturnId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "unitId": this._loggedService.currentUserValue.user.unitId,
                "returnTypeId":[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            }),
            tGrnreturnDetails: this._formbuilder.array([]),
            grnReturnCurrentStock: this._formbuilder.array([]),
            grnReturnReturnQt: this._formbuilder.array([]),
        })
    }

    get grnReturnDetArray(): FormArray {
        return this.GrnReturnForm.get('tGrnreturnDetails') as FormArray;
    }

    createGrnReturnDetInsert(element: any = {}): FormGroup {
        
        let ExpinputDate=''
        if(element?.batchExpDate)
          ExpinputDate = this.datePipe.transform(element?.batchExpDate ?? element?.batchExpiryDate,"yyyy-MM-dd")
        else
             ExpinputDate='1900-01-01';
       
       
        // let inputDate = element?.BatchExpDate ?? element?.batchExpiryDate;
        // let ExpDate = '1900-01-01';

        // if (inputDate) {
        //     inputDate = inputDate.split(' ')[0];

        //     if (inputDate.includes('-')) {
        //         // dd-MM-yyyy → convert to yyyy-MM-dd
        //         const parts = inputDate.split('-');
        //         const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        //         ExpDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        //     }
        //     else if (inputDate.includes('/')) {
        //         // dd/MM/yyyy → convert to yyyy-MM-dd
        //         const parts = inputDate.split('/');
        //         const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        //         ExpDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        //     }
        // }
    console.log(element)
        const mrpTotal = element.returnQty * element.mrp;
        const PurchaseTotalAmt = element.returnQty * element.mrp
debugger

        return this._formbuilder.group({

            grnReturnId: [this.VGrnReturnID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [element.itemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            batchNo: [element.batchNo || 0],
            batchExpiryDate: [ExpinputDate, [this._FormvalidationserviceService.validDateValidator()]],
            returnQty: [element.returnQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            landedRate: [element.landedRate || 0],
            mrp: [element.mrp || 0],
            unitPurchaseRate: [element.mrp || 0],
            cgstper: [element.cgst ?? 0],
            sgstper: [element.sgst ?? 0],
            igstper: [element.igst ?? 0],
            gstPercentage: [element.gstPercentage || 0],
            gstAmount: [element.gstAmount || 0],
            discPercentage: [element.discPercentage || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discAmount: [element.discAmount || 0],
            landedTotalAmount: [element.landedTotalAmount || 0],
            mrpTotalAmount: [mrpTotal || 0],
            purchaseTotalAmount: [PurchaseTotalAmt || 0],
            conversion: [element.conversion || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            remarks: '',
            stkId: [element.stkId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cf: [element.conversion || 1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            totalQty: [element.totalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            grnid: [element.grnId, [this._FormvalidationserviceService.onlyNumberValidator()]],

        });
    }

    get grnReturnCurrentStockArray(): FormArray {
        return this.GrnReturnForm.get('grnReturnCurrentStock') as FormArray;
    }

    createGrnReturnCurrentStockInsert(element: any = {}): FormGroup {
        return this._formbuilder.group({
            itemId: [element.itemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            issueQty: [element.totalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            iStkId: [element.stkId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            storeId: [this.vStoreId, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    get grnReturnQtyArray(): FormArray {
        return this.GrnReturnForm.get('grnReturnReturnQt') as FormArray;
    }

    createGrnReturnQtyInsert(element: any = {}): FormGroup { 
      //  const issueqty = element.balanceQty - element.returnQty
        return this._formbuilder.group({
            grndetId: [element.GRNDetID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            returnQty: [element.totalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
            //returnQty: [issueqty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    selectChangeStore(obj: any) {
        this.vStoreId = obj.value
    }

    selectChangeSupplier(obj: any) {
        this.VsupplierId = obj.value
    }
    selectChangetype(obj: any) {
        debugger
        console.log("Type:", obj); 
    }
    getGrnItemDetailList(Params) {
        // ;
        this.chargeslist = [];
        const Param = {
            "first": 0,
            "rows": 9999,
            "sortField": "GRNID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "GRNID",
                    "fieldValue": String(Params.grnid),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        };

        this._GRNReturnService.getGrnItemList(Param).subscribe(data => {
            console.log(data.data)

debugger
            const itemList = data.data as ItemNameList[];
            if (!itemList || itemList.length === 0) {
                this.toastr.warning(
                    `Some items have balance 0.`, 'Warning!',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return;
            }

            // ✅ check balanceQty here
            const zeroBalanceItems = itemList.filter(x => x.balanceQty == 0);
            if (zeroBalanceItems.length > 0) {
                this.toastr.warning(
                    `Some items have balance 0 (e.g., ${zeroBalanceItems[0].itemName}).`,
                    'Warning!',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return; // stop further processing if balance = 0
            }

            itemList.forEach(element => {
                this.chargeslist.push({
                    itemId: element.itemId || 0,
                    itemName: element.itemName || '',
                    batchNo: element.batchNo || 0,
                    batchExpDate: this.datePipe.transform(element.batchExpDate,'yyyy-MM-dd') || '1900-01-01',
                    conversion: element.conversionFactor || 1,
                    balanceQty: element.balanceQty,
                    returnQty: 0,
                    mrp: element.mrp || 0,
                    receiveQty: element.receiveQty || 0,
                    landedTotalAmount: 0,
                    cgst: (element.vatPer || 0) / 2,
                    sgst: (element.vatPer || 0) / 2,
                    igst: 0,
                    gstPercentage: element.vatPer || 0,
                    gstAmount: 0,
                    discPercentage: element.discPercentage || 0,
                    discAmount: 0,
                    landedRate: element.rate || 0,
                    netAmount: 0,
                    stkId: element.stkId || 0,
                    grnId: element.grnid || 0,
                    GRNDetID: element.grnDetID || 0,
                    totalQty: 0
                });
            });

            // Assign after all items are processed
            this.dsGrnItemList.data = this.chargeslist;

            this.dsGrnItemList.sort = this.sort;
            this.dsGrnItemList.paginator = this.paginator;
            this.getTotalamt(this.dsGrnItemList.data);
        });
    }

    deleteTableRow(elm) {
        // 
        this.dsGrnItemList.data = this.dsGrnItemList.data
            .filter(i => i !== elm)
            .map((i, idx) => (i.position = (idx + 1), i));
        this.toastr.success('Record Deleted Successfully', 'Success !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
    }

    parseDate(dateStr: string | null | undefined): Date | null {
        if (!dateStr) return null;  // prevent split on undefined/null

        const parts = dateStr.split(' ');
        const dateParts = parts[0]?.split('-') ?? [];

        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const time = parts[1] || '00:00:00';
            // convert dd-MM-yyyy HH:mm:ss → yyyy-MM-ddTHH:mm:ss
            return new Date(`${year}-${month}-${day}T${time}`);
        }
        return null;
    }


    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    getGRNreturnlist() {
        const vdata = {
            "first": 0,
            "rows": 9999,
            "sortField": "GRNReturnId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "GRNReturnId",
                    "fieldValue": String(this.registerObj.grnReturnId),
                    "opType": "Contains"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._GRNReturnService.getGRNReturnrtrvlist(vdata).subscribe(response => {
            // this.dsGrnItemList.data = response.data
            // const row = this.dsGrnItemList.data
            // this.getCellCalculation(row, row);
            this.dsGrnItemList.data = response.data.map(item => {
                const gstPer = item.gstPercentage || 0;
                return {
                    ...item,
                    cgst: gstPer / 2,
                    sgst: gstPer / 2
                };
            });

            // run calculations for each row
            this.dsGrnItemList.data.forEach(row => {
                this.getCellCalculation(row, row.returnQty);
            });

            console.log(this.dsGrnItemList.data)
            this.isGSTVisible = true;
        });
    }

    getTotalamt(element) {
        
        this.vFinalTotalAmount = (element.reduce((sum, { landedTotalAmount }) => sum += +(landedTotalAmount || 0), 0)).toFixed(2);
        this.vFinalVatAmount = (element.reduce((sum, { gstAmount }) => sum += +(gstAmount || 0), 0)).toFixed(2);
        this.vFinalDiscAmount = (element.reduce((sum, { discAmount }) => sum += +(discAmount || 0), 0)).toFixed(2);

        const finalAmt = (element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0)).toFixed(2);
        this.vFinalNetAmount = Math.round(finalAmt).toFixed(2);
        this.vRoundingAmt = (parseFloat(this.vFinalNetAmount) - (finalAmt)).toFixed(2);

        if (this.vGSTTpe === "Without GST") {
            this.vFinalVatAmount = "0.00";
        } else {
            this.vFinalVatAmount = (element.reduce((sum, { gstAmount }) => sum += +(gstAmount || 0), 0)).toFixed(2);
        }

        this._GRNReturnService.NewGRNRetFinalFrom.patchValue({
            FinalTotalAmount: this.vFinalTotalAmount,
            FinalDiscAmountt: this.vFinalDiscAmount,
            FinalVatAmount: this.vFinalVatAmount,
            FinalNetAmount: this.vFinalNetAmount,
            RoundingAmt: this.vRoundingAmt
        })
        // return this.vFinalTotalAmount;
    }

    onGSTTypeChange() {
        if (this.dsGrnItemList && this.dsGrnItemList.data.length > 0) {
            this.dsGrnItemList.data.forEach(contact => {
                this.getCellCalculation(contact, contact.returnQty);
            });

            // refresh totals after recalculation
            this.getTotalamt(this.dsGrnItemList.data);
        }
    }

    RQty: any;

    getCellCalculation(contact, returnQty) {
        contact.totalQty = (parseInt(contact?.returnQty || 0) * parseInt(contact?.conversion || 0));
        if (parseInt(contact?.totalQty || 0) > parseInt(contact?.balanceQty || 0)) {
            this.toastr.warning('Total Qty cannot be greater than Bal Qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            contact.returnQty = 0;
            contact.returnQty = '';
            contact.totalQty = 0;
            contact.landedTotalAmount = 0;
            contact.gstAmount = 0;
            contact.discAmount = 0;
            contact.netAmount = 0;
        }
        else {
            contact.totalQty = (parseInt(contact?.returnQty || 0) * parseInt(contact?.conversion || 0));
            contact.landedTotalAmount = (parseFloat(contact?.returnQty || 0) * parseFloat(contact.landedRate)).toFixed(2);
            contact.gstAmount = ((parseFloat(contact.landedTotalAmount) * parseFloat(contact.gstPercentage)) / 100).toFixed(2);
            contact.discAmount = ((parseFloat(contact.landedTotalAmount) * parseFloat(contact.discPercentage)) / 100).toFixed(2);
            const GrossAmt = (parseFloat(contact.landedTotalAmount) - parseFloat(contact.discAmount)).toFixed(2);
            contact.netAmount = (parseFloat(GrossAmt) + parseFloat(contact.gstAmount)).toFixed(2);

            // ✅ GST condition
            if (this.vGSTTpe === "Without GST") {
                contact.gstAmount = 0;
                // contact.netAmount = (parseFloat(contact.landedTotalAmount)).toFixed(2);
                contact.netAmount = GrossAmt;
            } else {
                contact.gstAmount = ((parseFloat(contact.landedTotalAmount) * parseFloat(contact.gstPercentage)) / 100).toFixed(2);
                contact.netAmount = (parseFloat(GrossAmt) + parseFloat(contact.gstAmount)).toFixed(2);
            }
        }
        this.getTotalamt(this.dsGrnItemList.data);
    }

    getValidationMessages() {
        return {
            ToStoreId: [
                { name: "required", Message: "Store Name is required" }
            ],
            SupplierId: [
                { name: "required", Message: "Supplier Name is required" }
            ],
            ReturnType: [
                { name: "required", Message: "Return Type Name is required" }
            ]
        };
    }

    Savebtn: boolean = false;

    OnSave() {
        
        const formattedDate = this.datePipe.transform(this.GrnReturnForm.get('grnReturn.grnreturnDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.GrnReturnForm.get('grnReturn.grnreturnDate').setValue(formattedDate);
        this.GrnReturnForm.get('grnReturn.grnreturnTime').setValue(formattedDate + ' ' + formattedTime);
         if (!this.isValidForm()) { 
            return;
        }
        if (this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value == 'GST Return') {
            this.GrnReturnForm.get('grnReturn.isGrnTypeFlag').setValue(true)
        } else
            this.GrnReturnForm.get('grnReturn.isGrnTypeFlag').setValue(false)

        this.GrnReturnForm.get('grnReturn.grnreturnId').setValue(this.VGrnReturnID ?? 0)
        this.GrnReturnForm.get('grnReturn.grnid').setValue(this.vGRNID)
        this.GrnReturnForm.get('grnReturn.supplierId').setValue(Number(this.VsupplierId))
        this.GrnReturnForm.get('grnReturn.totalAmount').setValue(this.vFinalTotalAmount)
        this.GrnReturnForm.get('grnReturn.grnReturnAmount').setValue(this.vFinalTotalAmount)
        this.GrnReturnForm.get('grnReturn.totalDiscAmount').setValue(this.vFinalDiscAmount)
        this.GrnReturnForm.get('grnReturn.totalVatAmount').setValue(this.vFinalVatAmount)
        this.GrnReturnForm.get('grnReturn.netAmount').setValue(this.vFinalNetAmount)
        this.GrnReturnForm.get('grnReturn.remark').setValue(this._GRNReturnService.NewGRNRetFinalFrom.get('Remark').value)
        this.GrnReturnForm.get('grnReturn.grnType').setValue(this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value)
        this.GrnReturnForm.get('grnReturn.returnTypeId').setValue(this._GRNReturnService.NewGRNReturnFrom.get('ReturnType')?.value || 0)
    
    
         
            if ((!this.dsGrnItemList.data.length)) {
                this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            if ((this.VsupplierId == '' || this.VsupplierId == '0' || this.VsupplierId == null || this.VsupplierId == undefined)) {
                this.toastr.warning('Please Select Supplier name.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            if ((this.vStoreId == '' || this.vStoreId == '0' || this.vStoreId == null || this.vStoreId == undefined)) {
                this.toastr.warning('Please Select Store Name.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            const hasInvalidQty = this.dsGrnItemList.data.some(item => !item.returnQty || isNaN(item.returnQty) || Number(item.returnQty) <= 0);

            if (hasInvalidQty) {
                this.toastr.warning('ReturnQty must be greater than zero.', 'Warning', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            let checkcashtype
            if (this.CashCredittype == false) {
                checkcashtype = false;
            } else {
                checkcashtype = true;
            }

            this.Savebtn = true;
            this.grnReturnDetArray.clear();

            this.dsGrnItemList.data.forEach(item => {
                // 
                // const input = item?.batchExpDate;
                // const [day, month, year] = input.split("/");
                // const [month, day, year] = input.split("/");

                // const formattedDate = `${year}-${month}-${day}`;

                this.grnReturnDetArray.push(this.createGrnReturnDetInsert(item));
            });

           
            this.grnReturnCurrentStockArray.clear();
            this.dsGrnItemList.data.forEach(item => {
                this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert(item));
            });

            this.grnReturnQtyArray.clear();
            this.dsGrnItemList.data.forEach(item => {
                this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert(item));
            });

            console.log(this.GrnReturnForm.value)
             if (!this.GrnReturnForm.invalid) {
       debugger
            this._GRNReturnService.GRNReturnSave(this.GrnReturnForm.value).subscribe(response => {
                if (response) {
                    
                    this.OnReset();
                    if(this.GrnReturnForm.get("grnReturn.grnreturnId").value==0)
                    this.viewgetGRNreturnReportPdf(response);
                else
                    this.viewgetGRNreturnReportPdf(this.GrnReturnForm.get("grnReturn.grnreturnId").value)
   
                    this.Savebtn = true;
                    this.isChecked = false;
                }
            });
        } else {
            
            const invalidFields = this.getInvalidFields(this.GrnReturnForm);

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
            }
        }
    }

    private getInvalidFields(form: AbstractControl, path: string = ''): string[] {
        let invalidFields: string[] = [];

        if (form instanceof FormGroup) {
            Object.keys(form.controls).forEach(key => {
                const control = form.get(key);
                if (control) {
                    invalidFields = invalidFields.concat(
                        this.getInvalidFields(control, path ? `${path} -> ${key}` : key)
                    );
                }
            });
        }
        else if (form instanceof FormArray) {
            form.controls.forEach((control, index) => {
                invalidFields = invalidFields.concat(
                    this.getInvalidFields(control, `${path}[${index + 1}]`)
                );
            });
        }
        else if (form.invalid) {
            invalidFields.push(path);
        }

        return invalidFields;
    }


    viewgetGRNreturnReportPdf(GRNReturnId) {
        this.commonService.Onprint("GRNReturnId", GRNReturnId, "GRNReturnReport");
    }
    OnReset() {
        this._GRNReturnService.NewGRNReturnFrom.reset();
        this._GRNReturnService.NewGRNRetFinalFrom.reset();
        this.dsGrnItemList.data = [];
        this._matDialog.closeAll();
        this.chargeslist.data = [];
    }

    vGRNID: any = 0;
    isGSTVisible: boolean = false;
    getGRNList() {
        this.dsGrnItemList.data = [];
        this.chargeslist.data = [];
        const dialogRef = this._matDialog.open(GrnListComponent,
            {
                // maxWidth: "100%",
                maxHeight: '95vh',
                width: '85%',
            });
        dialogRef.afterClosed().subscribe(result => {
            this.isGSTVisible = true;
            this.dsNewGRNReturnItemList.data = result as ItemNameList[];

            this.dsNewGRNReturnItemList.data.forEach(item => {
                console.log("Processing item:", item);

                this.getGrnItemDetailList(item);
                this.vGRNID = item.grnid
            });

            if (this.dsNewGRNReturnItemList.data.length > 0) {
                const firstItem = this.dsNewGRNReturnItemList.data[0];
                this.VsupplierId = firstItem.supplierId;
                this.vStoreId = firstItem.storeId;
                this.VsupplierName = firstItem.supplierName;
                // this.vGRNID = firstItem.grnid;
                this.CashCredittype = firstItem.cash_CreditType;
                // this.isChecked = firstItem.cash_CreditType === false;
            }
        });
    }
    onClose() {
        this._matDialog.closeAll();
    }
          isValidForm(): boolean {
        const invalidItem = this.dsGrnItemList.data.find((item, index) => {
            debugger
            if (item.returnQty <= 0) {
                this.toastr.warning(
                    `Row ${index + 1}: Return Quantity must be greater than 0`,
                    'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }

            if (item.totalQty <= 0) {
                this.toastr.warning(
                    `Row ${index + 1}: Total Quantity must be greater than 0`,
                    'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }
 
            return false;
        });

        return !invalidItem; // valid only if no invalid row
    }
}
