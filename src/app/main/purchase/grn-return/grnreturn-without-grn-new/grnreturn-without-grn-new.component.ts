import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { ItemNameList } from '../../grn-return-without-grn/grn-return-withoutgrn.component';
import { GRNReturnWithoutGRNService } from '../../grn-return-without-grn/grnreturn-without-grn.service';
// import { ItemNameList } from '../grn-return.component';


@Component({
    selector: 'app-grnreturn-without-grn-new',
    templateUrl: './grnreturn-without-grn-new.component.html',
    styleUrls: ['./grnreturn-without-grn-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GrnreturnWithoutGrnNewComponent {
    displayedColumns1 = [
        'ItemName',
        'BalQty',
        'GRNNo',
        'BatchNo',
        'ExpDate',
        // 'StockId',
    ];

    displayedColumns2 = [
        'ItemName',
        'BatchNo',
        'ConversionFactor',
        'ExpDate',
        'BalQty',
        'receiveQty',
        'Qty',
        'LandedRate',
        'TotalAmount',
        'UnitMRP',
        'PurchaseRate',
        'CGST',
        'SGST',
        'IGST',
        "GST",
        'GSTAmount',
        'NetAmount',
        'BalanceQty',
        'StockId',
        'buttons',
    ];

    dateTimeObj: any;
    StoreList: any = [];
    isSupplierIdSelected: boolean = false;
    filteredOptionssupplier: any;
    noOptionFoundsupplier: any;
    isItemIdSelected: boolean = false;
    lastsupplierflag: boolean = false;
    vItemName: any;
    vBatchNo: any;
    vExpDates: any;
    vBalQty: any;
    vQty: any;
    vLandedRate: any;
    vTotalAmount: any;
    vGST: any;
    vCGST: any;
    vSGST: any;
    vIGST: any;
    vGSTAmount: any;
    vNetAmount: any;
    filteredOptions: any;
    noOptionFound: any;
    ItemId: any;
    sIsLoading: string = '';
    ItemName: any;
    chargeslist: any = [];
    vGSTType: any;
    screenFromString = 'Common-form';
    SpinLoading: boolean = false;
    vGSTTpe = "GST Return";
    autocompletestore: string = "Store";
    autocompleteSupplier: string = "SupplierMaster"
    autocompleteModeGSTTypesValues: string = "GSTTypes";
    autocompleteModeGRNReturnTypes: string = "GRN_RETURN_TYPE";
    VsupplierId: any = 0
    vstoreId: any = this._loggedService.currentUserValue.user.storeId
    itemName: any;
    GrnReturnForm: FormGroup
    VGrnReturnID: any;
    vLandedrate: any;
    vUnitMRP: any;
    vStockId: any;
    vConversionFactor: any;
    vPurchaseRate: any;

    dsItemList = new MatTableDataSource<ItemNameList>();
    dsSupplierItemList = new MatTableDataSource<ItemNameList>();
    dsTempItemNameList = new MatTableDataSource<ItemNameList>();
    registerObj = new ItemNameList({});

    constructor(
        public _GRNReturnService: GRNReturnWithoutGRNService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        private commonService: PrintserviceService,
        public _formbuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }
  vGRNID: any = 0;
    ngOnInit(): void {
        console.log("GRN Return Without GRN:", this.data)
        if (this.data?.grnReturnId) {
            this.registerObj = this.data
            this.VsupplierId = this.data.supplierId
            this.VGrnReturnID = this.data?.grnReturnId
             //  this.vGRNID =  this.data?.grnid
            // this._GRNReturnService.ReturnFinalForm.get("Remark").setValue(this.registerObj?.remark)
           this._GRNReturnService.NewGRNReturnFrom.patchValue({ReturnType:this.data?.returnTypeId || 0})
            if (this.registerObj.isGrnTypeFlag == true) {
                this.vGSTTpe = 'GST Return';
            } else {
                this.vGSTTpe = 'Without GST';
            }
             this.getGRNreturnlist();
        } 
        this._GRNReturnService.NewGRNReturnFrom.markAllAsTouched(); 
        this.GrnReturnForm = this.CreateGrnReturnInsertForm(); 
        this.grnReturnDetArray.push(this.createGrnReturnDetInsert());
        this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert());
        this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert());

    }

    CreateGrnReturnInsertForm() {
        return this._formbuilder.group({
            grnReturn: this._formbuilder.group({

                "grnid": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "grnreturnDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                "grnreturnTime": this.datePipe.transform(new Date(), 'shortTime'),
                "storeId": [Number(this._loggedService.currentUserValue.user.storeId), [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "supplierId": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                "totalAmount": this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value || 0,
                "grnReturnAmount": this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value || 0,
                "totalDiscAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalVatAmount": this._GRNReturnService.ReturnFinalForm.get('FinalVatAmount').value || 0,
                "totalOtherTaxAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "totalOctroiAmount": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "netAmount": this._GRNReturnService.ReturnFinalForm.get('FinalNetPayamt').value || 0,
                "cashCredit": true,
                "remark": this._GRNReturnService.ReturnFinalForm.get('Remark').value || '',
                "isVerified": false,
                "addedBy": this._loggedService.currentUserValue.userId,
                "isCancelled": false,
                "isClosed": false,
                "grnType": this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value,
                "isGrnTypeFlag": false,
                "grnreturnId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                "unitId": this._loggedService.currentUserValue.user.unitId,
                "returnTypeId": [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

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
        
        const totalQty = (parseFloat(element.returnQty) * parseFloat(element.conversion))

        // const inputDate = element?.ExpDate ?? element?.batchExpiryDate;
        // let ExpDate = '1900-01-01';

        // if (inputDate) {
        //     if (inputDate.includes('-')) {
        //         ExpDate = inputDate
        //     }
        //     else if (inputDate.includes('/')) {
        //         // dd/MM/yyyy → convert to yyyy-MM-dd
        //         const parts = inputDate.split('/');
        //         const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        //         ExpDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        //     }
        // }

        console.log(element)
         let ExpinputDate=''
        if(element?.batchExpDate)
          ExpinputDate = this.datePipe.transform(element?.batchExpDate ?? element?.batchExpiryDate,"yyyy-MM-dd")
        else
             ExpinputDate='1900-01-01';

         console.log(element)
        const mrpTotal = element.returnQty * element.mrp;
        const PurchaseTotalAmt = element.returnQty * element.mrp
;
       
debugger
        return this._formbuilder.group({
            grnReturnId: [this.VGrnReturnID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // grnReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [element.itemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            batchNo: [element.batchNo || 0],
            batchExpiryDate: [ExpinputDate, [this._FormvalidationserviceService.validDateValidator()]],
            returnQty: [element.returnQty || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            landedRate: [element.landedRate || 0],
            mrp: [element.mrp || 0],
            unitPurchaseRate: [element.unitPurchaseRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            cgstper: [element.cgst ?? 0],
            sgstper: [element.sgst ?? 0],
            igstper: [element.igst ?? 0],
            gstPercentage: [element.gstPercentage || 0],
            gstAmount: [element.gstAmount || 0],
            discPercentage: [element.DiscPercentage || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [element.DiscAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            landedTotalAmount: [element.landedTotalAmount || 0],
            mrpTotalAmount: [mrpTotal || this.mrpTotalAmount || 0],
            purchaseTotalAmount: [PurchaseTotalAmt],
            conversion: [element.conversion || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            remarks: '',
            stkId: [element.stkId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cf: [element.conversion || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
            storeID: [this.vstoreId, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    get grnReturnQtyArray(): FormArray {
        return this.GrnReturnForm.get('grnReturnReturnQt') as FormArray;
    }

    createGrnReturnQtyInsert(element: any = {}): FormGroup {
        debugger
      //  const issueqty = +element.BalQty - +element.returnQty
        return this._formbuilder.group({
            grndetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            returnQty: [element.totalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    selectChangeItem(obj: any) {
        if (!obj || typeof obj !== 'object') {
            this.toastr.error('Invalid item selection. Please choose a valid item from the list.', 'Error!');
            this._GRNReturnService.NewGRNReturnFrom.get('ItemName').setErrors({ invalidItem: true });
            return;
        }
        console.log("Item:", obj);
        this.ItemId = obj.itemId;
        this.itemName = obj.itemName
        this._GRNReturnService.NewGRNReturnFrom.get('ItemName').setValue(obj);

        this.getBatch();
    }

    getBatch() {
        this.setFocus('Qty');
        const dialogRef = this._matDialog.open(SalePopupComponent,
            {
                maxWidth: "800px",
                minWidth: '800px',
                width: '800px',
                height: '380px',
                disableClose: true,
                data: {
                    "ItemId": this.ItemId,
                    "StoreId": this.vstoreId,
                    formName: "GRNReturn Without GRN"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            result = result.selectedData
            this.vBatchNo = result.batchNo;
            this.vExpDates = this.datePipe.transform(result.batchExpDate, "yyyy-MM-dd");
            this.vQty = '';
            this.vBalQty = result.balanceQty;
            this.vLandedRate = result.landedRate;
            this.vTotalAmount = 0;
            this.vCGST = (result.vatPercentage ?? 0) / 2; //|| 1;
            this.vSGST = (result.vatPercentage ?? 0) / 2; //|| 1;
            this.vIGST = result.igstPer; //|| 1;
            this.vGST = result.vatPercentage; //|| 1;
            // this._GRNReturnService.NewGRNReturnFrom.get('GST').setValue(this.vGST) //|| 1;
            this.vGSTAmount = 0;
            this.vNetAmount = 0;
            this.vUnitMRP = result.unitMRP;
            this.vStockId = result.stockId;
            this.vConversionFactor = (result.converFactor === '%') ? 1 : result.converFactor; //becasue i am getting % from list but during insert it ask number
            this.vPurchaseRate = result.purchaseRate;

            if ((result?.cgstPer ?? 0) > 0) {
                this._GRNReturnService.NewGRNReturnFrom.patchValue({
                    CGST: result?.vatPercentage,
                    SGST: result?.sgstPer,
                    IGST: 0,
                    GST: result?.vatPercentage
                });

                this._GRNReturnService.NewGRNReturnFrom.get('CGST').enable();
                this._GRNReturnService.NewGRNReturnFrom.get('IGST').reset();
                this._GRNReturnService.NewGRNReturnFrom.get('IGST').clearValidators();
                this._GRNReturnService.NewGRNReturnFrom.get('IGST').updateValueAndValidity();
                this._GRNReturnService.NewGRNReturnFrom.get('IGST').disable();

            } else if ((result?.igstPer ?? 0) > 0) {
                this._GRNReturnService.NewGRNReturnFrom.patchValue({
                    CGST: 0,
                    SGST: 0,
                    IGST: result?.igstPer,
                    GST: result?.vatPercentage
                });

                this._GRNReturnService.NewGRNReturnFrom.get('IGST').enable();
                this._GRNReturnService.NewGRNReturnFrom.get('CGST').reset();
                this._GRNReturnService.NewGRNReturnFrom.get('CGST').clearValidators();
                this._GRNReturnService.NewGRNReturnFrom.get('CGST').updateValueAndValidity();
                this._GRNReturnService.NewGRNReturnFrom.get('CGST').disable();

            } else {
                // ✅ Both missing → don’t disable any, keep them editable
                this._GRNReturnService.NewGRNReturnFrom.patchValue({
                    CGST: 0,
                    SGST: 0,
                    IGST: 0,
                    GST: 0
                });

                this._GRNReturnService.NewGRNReturnFrom.get('CGST').enable();
                this._GRNReturnService.NewGRNReturnFrom.get('IGST').enable();
            }
        });
    }

    getchangegstper(rate: any): void {
        
        if (Number(rate?.value) > 0) {
            this.vGST = Number(rate.text)
            this.vSGST = Number((rate.value) / 2),
                this.vCGST = Number((rate.value) / 2),
                this.vIGST = 0
            this._GRNReturnService.NewGRNReturnFrom.patchValue({
                SGST: Number((rate.value) / 2),
                IGST: 0,
                GST: Number(rate.value)
            })
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').reset();
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').clearValidators();
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').updateValueAndValidity();
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').disable();
        } else {
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').enable();
            this._GRNReturnService.NewGRNReturnFrom.get('IGST').reset();
        }
        this.CalculateTotalAmt();
    }

    getchangeIgstper(rate: any): void {
        
        this.vIGST = Number(rate.text)
        this.vCGST = 0
        this.vSGST = 0
        this.vGST = Number(rate.text)
        if (Number(rate?.text) > 0) {
            this.vGST = Number(rate.text)
            this._GRNReturnService.NewGRNReturnFrom.patchValue({
                SGST: 0,
                CGST: 0,
                GST: Number(rate.text),
            })
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').reset();
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').clearValidators();
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').updateValueAndValidity();
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').disable();
        } else {
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').enable();
            this._GRNReturnService.NewGRNReturnFrom.get('CGST').reset();
        }
        this.CalculateTotalAmt();
    }

    onAdd() {
        if (!this.vQty) {
            this.toastr.warning('Please enter a Qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        const batchNo = this._GRNReturnService.NewGRNReturnFrom.get('BatchNo')?.value;
        const isDuplicate = this.dsItemList.data.some(item => item.batchNo === batchNo);

        if (!isDuplicate) {
            // append instead of resetting
            const newItem = {
                itemId: this.ItemId || 0,
                itemName: this.itemName || '',
                batchNo: this.vBatchNo || '',
                conversion: this.vConversionFactor || 1,
                ExpDate: this.vExpDates,
                BalQty: this.vBalQty || 0,
                returnQty: this.vQty || 0,
                landedRate: this.vLandedRate || 0,
                landedTotalAmount: this.vTotalAmount || 0,
                mrp: this.vUnitMRP || 0,
                unitPurchaseRate: this.vPurchaseRate || 0,
                cgst: this.vCGST || 0,
                sgst: this.vSGST || 0,
                igst: this.vIGST || 0,
                gstPercentage: this.vGST || 0,
                gstAmount: this.vGSTAmount || 0,
                netAmount: this.vNetAmount || 0,
                balanceQty: (parseFloat(this.vBalQty) - parseFloat(this.vQty)),
                stkId: this.vStockId || 0
            };

            //  Append to MatTableDataSource safely

            this.dsItemList.data = this.dsItemList.data.concat(newItem as ItemNameList);
            this.getGSTTotalAmt(this.dsItemList.data);

        } else {
            this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }

        this.ItemReset();
        this.setFocus('ItemName');
        this._GRNReturnService.NewGRNReturnFrom.get('ItemName')?.setValue('');
        this._GRNReturnService.NewGRNReturnFrom.get('CGST').reset();
        this._GRNReturnService.NewGRNReturnFrom.get('CGST').enable();
        this._GRNReturnService.NewGRNReturnFrom.get('IGST').reset();
        this._GRNReturnService.NewGRNReturnFrom.get('IGST').enable();
    }

    ItemReset() {
        this.vItemName = '';
        this.ItemName = '';
        this.ItemId = 0;
        this.vBatchNo = '';
        this.vExpDates = '';
        this.vBalQty = 0;
        this.vQty = 0;
        this.vLandedRate = 0;
        this.vTotalAmount = 0;
        this.vCGST = 0;
        this.vSGST = 0;
        this.vIGST = 0;
        this.vGST = 0;
        this.vGSTAmount = 0;
        this.vNetAmount = 0;
        this._GRNReturnService.NewGRNReturnFrom.get('CGST').reset();
        this._GRNReturnService.NewGRNReturnFrom.get('SGST').reset();
        this._GRNReturnService.NewGRNReturnFrom.get('IGST').reset();
    }

    deleteTableRow(element: ItemNameList) {
        const currentData = this.dsItemList.data;
        const index = currentData.indexOf(element);

        if (index >= 0) {
            currentData.splice(index, 1); // remove element
            this.dsItemList.data = [...currentData]; // trigger table update
            this.getGSTTotalAmt(this.dsItemList.data);
        }

        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    ItemFromReset() {
        const form = this._GRNReturnService.NewGRNReturnFrom;
        form.patchValue({
            ItemName: "",
            BatchNo: "",
            ExpDates: "",
            BalQty: "",
            Qty: "",
            Rate: "",
            CGST: "",
            SGST: "",
            IGST: "",
            GST: "",
            TotalAmount: "",
            LandedRate: "",
            NetAmount: "",
            GSTAmount: ""
        });
        this.vExpDates = ""
        this.vBalQty = ""
        this.vQty = ""
        this.vLandedRate = ""
        this.vTotalAmount = ""
        this.vGSTAmount = ""
        this.vNetAmount = ""
    }

    selectChangeStore(obj: any) {
        console.log("Store:", obj);
        this.vstoreId = obj.value
    }

    selectChangeSupplier(obj: any) {
        console.log("Supplier:", obj);
        this.VsupplierId = obj.value
        this.lastsupplierflag = true
        this.getItemListBySupplier();
    }
    selectChangetype(obj: any) {
        debugger
        console.log("Type:", obj); 
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
            // this.dsItemList.data = response.data

            this.dsItemList.data = response.data.map(item => {
                const gstPer = item.gstPercentage || 0;
                return {
                    ...item,
                    cgst: gstPer / 2,
                    sgst: gstPer / 2,
                    BalQty: (item.balanceQty + item.returnQty)
                };
            });

            console.log(this.dsItemList.data)
            this.getGSTTotalAmt(this.dsItemList.data)
        });
    }

    CalculateTotalAmt() {
        
        const qty = Number(this.vQty) || 0;
        const balQty = Number(this.vBalQty) || 0;
        const landedRate = Number(this.vLandedRate) || 0;
        const gstPercent = Number(this.vGST) || 0;

        if (qty > 0 && balQty >= qty) {
            this.vTotalAmount = Number((qty * landedRate).toFixed(2));
            this.vNetAmount = this.vTotalAmount;
        } else {
            this.vQty = '';
            this.vTotalAmount = 0;
            this.vGSTAmount = 0;
            this.vNetAmount = 0;
            this.toastr.warning('Please enter Qty less than BalQty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return; // stop here if invalid
        }

        const RadioValue = this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value || 'Without GST';
        console.log('Selected GSTType:', RadioValue);

        if (RadioValue === 'GST Return') {
            this.vGSTAmount = Number(((gstPercent * this.vTotalAmount) / 100).toFixed(2));
            this.vNetAmount = Number((this.vTotalAmount + this.vGSTAmount).toFixed(2));
        } else {
            this.vGSTAmount = 0;
            // this.vGST=0
            this.vNetAmount = this.vTotalAmount;
        }
    }

    vTotalFinalAmount: any;
    vFinalDisAmount: any;
    vFinalVatAmount: any;
    vFinalNetAmount: any;
    vNetRoundAmt: any;
    mrpTotalAmount: any;

    getGSTTotalAmt(element: any[]) {
        // editable qty from list in loop
        element.forEach(item => {
            item.balanceQty = (parseFloat(item.BalQty || 0) - parseFloat(item.returnQty || 0)).toString();
        });

        this.vFinalVatAmount = element.reduce((sum, { gstAmount }) => sum + +(gstAmount || 0), 0).toFixed(2);

        this.vTotalFinalAmount = (element.reduce((sum, { landedTotalAmount }) => sum += +(landedTotalAmount || 0), 0)).toFixed(2);

        const FinalRoundAmt = (element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0)).toFixed(2);
        this.mrpTotalAmount = (element.reduce((sum, { mrp }) => sum += +(mrp || 0), 0)).toFixed(2);
        this.vFinalNetAmount = Math.round(FinalRoundAmt).toFixed(2);
        this.vNetRoundAmt = (parseFloat(this.vFinalNetAmount) - (FinalRoundAmt)).toFixed(2);

        this._GRNReturnService.ReturnFinalForm.patchValue({
            FinalVatAmount: this.vFinalVatAmount,
            FinalTotalAmt: this.vTotalFinalAmount,
            FinalNetPayamt: this.vFinalNetAmount,
            RoundingAmt: this.vNetRoundAmt
        })
    }

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    getItemListBySupplier() {
        const vdata = {
            "first": 0,
            "rows": 999999,
            "sortField": "GRNID",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "SupplierId", "fieldValue": String(this.VsupplierId), "opType": "Equals" },
                { "fieldName": "StoreId", "fieldValue": String(this.vstoreId), "opType": "Equals" }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._GRNReturnService.getItemBySupplier(vdata).subscribe(data => {
            this.dsSupplierItemList.data = data.data as ItemNameList[];

            this.dsSupplierItemList.paginator = this.paginator;

            console.log("supplier List:", this.dsSupplierItemList.data)
        });
    }

    selectedRowIndex: number = -1;
    onRowClick(rowData: any) {
        console.log("Selected Row Data:", rowData);
         this.vGRNID = 0 //rowData.grnid || 0
            
        const converted = {
            ...rowData,
            conversion: rowData.conversionFactor,
            BalQty: rowData.balanceQty,
            batchExpiryDate: this.datePipe.transform(rowData.batchExpDate,'yyyy-MM-dd') || '1900-01-01',
            landedTotalAmount: rowData.totalAmount,
            unitPurchaseRate: rowData.rate,
            cgst: rowData.cgstper,
            sgst: rowData.sgstper,
            igst: rowData.igstper,
            gstPercentage: rowData.vatPercentage,
            gstAmount: rowData.vatAmount,
            returnQty:0,
            grnId: 0,  //rowData.grnid || 0,

            //  itemId: element.itemId || 0,
            //         itemName: element.itemName || '',
            //         batchNo: element.batchNo || 0,
            //         batchExpDate: element.batchExpDate,
            //         conversion: element.conversionFactor || 1,
            //         balanceQty: element.balanceQty,
            //         returnQty: 0,
                    mrp: rowData.mrp || 0,
            //         receiveQty: element.receiveQty || 0,
            //         landedTotalAmount: 0,
            //         cgst: (element.vatPer || 0) / 2,
            //         sgst: (element.vatPer || 0) / 2,
            //         igst: 0,
            //         gstPercentage: element.vatPer || 0,
            //         gstAmount: 0,
            //         discPercentage: element.discPercentage || 0,
            //         discAmount: 0,
            //         landedRate: element.rate || 0,
            //         netAmount: 0,
            //         stkId: element.stkId || 0,
            //         grnId: element.grnid || 0,
            //         GRNDetID: element.grnDetID || 0,
            //         totalQty: 0
        };

        // 2) Highlight row (optional)
        this.selectedRowIndex = this.dsSupplierItemList.data.indexOf(rowData);

        const exists = this.dsItemList.data.some(
            item => item.itemId === converted.itemId
        );

        if (exists) {
            this.toastr.warning('Duplicate item', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.dsItemList.data = [...this.dsItemList.data, converted];
        // this.dsItemList.paginator = this.paginator;
        this.getGSTTotalAmt(this.dsItemList.data);
    }

    getCellCalculation(contact, returnQty) {
          contact.totalQty = (parseInt(contact?.returnQty || 0) * parseInt(contact?.conversion || 0));
        if (parseInt(contact?.totalQty || 0) > parseInt(contact?.BalQty || 0)) { 
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
        this.getGSTTotalAmt(this.dsItemList.data);
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
      
        this.GrnReturnForm.get('grnReturn.supplierId').setValue(this.VsupplierId)
        this.GrnReturnForm.get('grnReturn.totalAmount').setValue(this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value)
        this.GrnReturnForm.get('grnReturn.grnReturnAmount').setValue(this._GRNReturnService.ReturnFinalForm.get('FinalTotalAmt').value)
        this.GrnReturnForm.get('grnReturn.totalVatAmount').setValue(this._GRNReturnService.ReturnFinalForm.get('FinalVatAmount').value)
        this.GrnReturnForm.get('grnReturn.netAmount').setValue(this._GRNReturnService.ReturnFinalForm.get('FinalNetPayamt').value)
        this.GrnReturnForm.get('grnReturn.remark').setValue(this._GRNReturnService.ReturnFinalForm.get('Remark').value)
        this.GrnReturnForm.get('grnReturn.grnType').setValue(this._GRNReturnService.NewGRNReturnFrom.get('GSTType').value)
        this.GrnReturnForm.get('grnReturn.returnTypeId').setValue(this._GRNReturnService.NewGRNReturnFrom.get('ReturnType')?.value || 0)


        if ((!this.dsItemList.data.length)) {
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
        if ((this.vstoreId == '' || this.vstoreId == '0' || this.vstoreId == null || this.vstoreId == undefined)) {
            this.toastr.warning('Please Select Store Name.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        
        this.Savebtn = true;
        this.grnReturnDetArray.clear();
        this.dsItemList.data.forEach(item => {
            console.log(this.dsItemList.data)
            this.grnReturnDetArray.push(this.createGrnReturnDetInsert(item));
        });

        this.grnReturnCurrentStockArray.clear();
        this.dsItemList.data.forEach(item => {
            this.grnReturnCurrentStockArray.push(this.createGrnReturnCurrentStockInsert(item));
        });

        this.grnReturnQtyArray.clear();
        this.dsItemList.data.forEach(item => {
            this.grnReturnQtyArray.push(this.createGrnReturnQtyInsert(item));
        });

        console.log(this.GrnReturnForm.value)
        debugger
        if (!this.GrnReturnForm.invalid) {
            this._GRNReturnService.GRNReturnSave(this.GrnReturnForm.value).subscribe(response => {
                // if (response) {
                //     this.OnReset();
                //     this.viewgetgrnreturnReportPdf(response);
                //     this.Savebtn = true;
                // }

                 if (response) {
                    debugger
                    this.OnReset();
                    if(this.GrnReturnForm.get("grnReturn.grnreturnId").value==0)
                    this.viewgetgrnreturnReportPdf(response);
                else
                    this.viewgetgrnreturnReportPdf(this.GrnReturnForm.get("grnReturn.grnreturnId").value)
   
                    this.Savebtn = true;
                    // this.isChecked = false;
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

    OnReset() {
        this.dsItemList.data = [];
        this.chargeslist.data = [];
        this.dsTempItemNameList.data = [];
        this._GRNReturnService.NewGRNReturnFrom.reset();
        this._GRNReturnService.ReturnFinalForm.reset();
        this._matDialog.closeAll();
    }

    onClose() {
        this._matDialog.closeAll();
        this._GRNReturnService.NewGRNReturnFrom.reset();
    }

    public setFocus(nextElementId): void {
        document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
    }

    viewgetgrnreturnReportPdf(GRNReturnId) {
        this.commonService.Onprint("GRNReturnId", GRNReturnId, "GRNReturnReport");
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
      isValidForm(): boolean {
        const invalidItem = this.dsItemList.data.find((item, index) => {
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


// {
//     "grnid": 231884,
//     "grnNumber": "1885",
//     "grndate": "2026-04-20T00:00:00",
//     "storeId": 2,
//     "itemName": "ACAMPROL TAB",
//     "receiveQty": 20,
//     "freeQty": 0,
//     "mrp": 83.33,
//     "rate": 200,
//     "totalAmount": 4000,
//     "conversionFactor": 6,
//     "vatPercentage": 12,
//     "vatAmount": 200,
//     "discPercentage": 0,
//     "discAmount": 0,
//     "landedRate": 35,
//     "netAmount": 4200,
//     "grossAmount": 4200,
//     "totalQty": 120,
//     "batchNo": "ABF",
//     "batchExpDate": "2026-09-30T00:00:00",
//     "cgstper": 2.5,
//     "cgstamt": 100,
//     "sgstper": 2.5,
//     "sgstamt": 100,
//     "igstper": 0,
//     "igstamt": 0,
//     "returnQty": 0,
//     "balanceQty": 120,
//     "stkId": 184099,
//     "stockId": 184099,
//     "itemId": 22
// }