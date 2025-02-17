import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StoreMaster, StoreMasterComponent } from "../store-master.component";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
    selector: "app-store-form-master",
    templateUrl: "./store-form-master.component.html",
    styleUrls: ["./store-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {
    Header: string;
    editorConfig: AngularEditorConfig = {
        // color:true,
        editable: true,
        spellcheck: true,
        height: '35rem',
        minHeight: '35rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,

    };
    onBlur(e: any) {
        this.Header = e.target.innerHTML;
    }
    msg: any;
    Savebtn: boolean = false;
    vshortName: any;
    vStoreName: any;
    vIndentPrefix: any;
    vIndentNo: any;
    vGrnreturnNoPrefix: any;
    vGrnreturnNo: any;
    vPurchasePrefix: any;
    vPurchaseNo: any;
    vIssueToDeptPrefix: any;
    vIssueToDeptNo: any;
    vGrnPrefix: any;
    vGrnNo: any;
    vReturnFromDeptNoPrefix: any;
    vReturnFromDeptNo: any;
    registerObj = new StoreMaster({});
    vStoreId: any;
    vDeleted: any = 1;
    checkradiobtn: any;
    updated: boolean = false;
    filteredOptionsphsalesCashCounter: Observable<string[]>;
    CashCounterList1: any = [];
    filteredOptionsphsalesrecCashCounter: Observable<string[]>;
    filteredOptionsphAdvRecesCashCounter: Observable<string[]>;
    CashCounterList2: any = [];
    filteredOptionsphsalesreturnCashCounter: Observable<string[]>;
    filteredOptionsphAdvCashCounter: Observable<string[]>;
    filteredOptionsphAdvRefundCashCounter: Observable<string[]>;
    filteredOptionsphAdvRefRecesCashCounter: Observable<string[]>;
    CashCounterList3: any = [];

    isCashCounter1Selected: boolean = false;
    isCashCounter2Selected: boolean = false;
    isCashCounter3Selected: boolean = false;
    isCashCounterAdvSelected: boolean = false;
    isCashCounterAdvReceSelected: boolean = false;
    isCashCounterAdvRefundSelected: boolean = false;
    isCashCounterAdvRefundReceSelected: boolean = false;
    vCashcount1: any;
    vCashcount2: any;
    vCashcount3: any;
    vAdvCashcount:any;
    vPrintStoreName:any;
    vPrintStoreAddress:any;
    vPrintTermsCondition:any;
    vCashcountAdvReceipt:any;
    vCashcountAdvRefund:any;
    

    constructor(
        public _StoreService: StoreMasterService,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<StoreMasterComponent>,
        private elementRef: ElementRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.registerObj = this.data.Obj;
            this.updated = true;
            console.log(this.registerObj);
            this.vStoreId = this.registerObj.StoreId;
            this.vshortName = this.registerObj.StoreShortName;
            this.vStoreName = this.registerObj.StoreName;
            this.vIndentPrefix = this.registerObj.IndentPrefix;
            this.vIndentNo = this.registerObj.IndentNo.trim();
            this.vGrnreturnNoPrefix = this.registerObj.GrnreturnNoPrefix;
            this.vGrnreturnNo = this.registerObj.GrnreturnNo.trim();
            this.vPurchasePrefix = this.registerObj.PurchasePrefix;
            this.vPurchaseNo = this.registerObj.PurchaseNo.trim();
            this.vIssueToDeptPrefix = this.registerObj.IssueToDeptPrefix;
            this.vIssueToDeptNo = this.registerObj.IssueToDeptNo.trim();
            this.vGrnPrefix = this.registerObj.GrnPrefix;
            this.vGrnNo = this.registerObj.GrnNo.trim();
            this.vReturnFromDeptNoPrefix = this.registerObj.ReturnFromDeptNoPrefix;
            this.vReturnFromDeptNo = this.registerObj.ReturnFromDeptNo.trim();
            this.Header = this.registerObj.Header;
            debugger
            // this.checkradiobtn = JSON.stringify(this.registerObj.IsDeleted);

        }

        this.getCashCountersalesComboList();
        this.getCashCountersalesrecComboList();
        this.getCashCountersalesreturnComboList();


    }
    focusNext(nextElementId: string): void {
        const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
        if (nextElement) {
            nextElement.focus();
        }
    }




    onSubmit() {
        if ((this.vshortName == '' || this.vshortName == null || this.vshortName == undefined)) {
            this.toastr.warning('Please enter a ShortName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vStoreName == '' || this.vStoreName == null || this.vStoreName == undefined)) {
            this.toastr.warning('Please enter a StoreName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIndentPrefix == '' || this.vIndentPrefix == null || this.vIndentPrefix == undefined)) {
            this.toastr.warning('Please enter a IndentPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIndentNo == '' || this.vIndentNo == null || this.vIndentNo == undefined)) {
            this.toastr.warning('Please enter a IndentNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnreturnNoPrefix == '' || this.vGrnreturnNoPrefix == null || this.vGrnreturnNoPrefix == undefined)) {
            this.toastr.warning('Please enter a GRN ReturnPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnreturnNo == '' || this.vGrnreturnNo == null || this.vGrnreturnNo == undefined)) {
            this.toastr.warning('Please enter a GRN ReturnNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vPurchasePrefix == '' || this.vPurchasePrefix == null || this.vPurchasePrefix == undefined)) {
            this.toastr.warning('Please enter a PurchasePrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vPurchaseNo == '' || this.vPurchaseNo == null || this.vPurchaseNo == undefined)) {
            this.toastr.warning('Please enter a PurchaseNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIssueToDeptPrefix == '' || this.vIssueToDeptPrefix == null || this.vIssueToDeptPrefix == undefined)) {
            this.toastr.warning('Please enter a IssueToDeptPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIssueToDeptNo == '' || this.vIssueToDeptNo == null || this.vIssueToDeptNo == undefined)) {
            this.toastr.warning('Please enter a IssueToDeptNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnPrefix == '' || this.vGrnPrefix == null || this.vGrnPrefix == undefined)) {
            this.toastr.warning('Please enter a GRNPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnNo == '' || this.vGrnNo == null || this.vGrnNo == undefined)) {
            this.toastr.warning('Please enter a GRNNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vReturnFromDeptNoPrefix == '' || this.vReturnFromDeptNoPrefix == null || this.vReturnFromDeptNoPrefix == undefined)) {
            this.toastr.warning('Please enter a ReturnFromDeptPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vReturnFromDeptNo == '' || this.vReturnFromDeptNo == null || this.vReturnFromDeptNo == undefined)) {
            this.toastr.warning('Please enter a ReturnFromDeptNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vCashcount1 == '' || this.vCashcount1 == null || this.vCashcount1 == undefined)) {
            this.toastr.warning('Please select valid Cash Counter 1', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vCashcount2 == '' || this.vCashcount2 == null || this.vCashcount2 == undefined)) {
            this.toastr.warning('Please select valid Cash Counter 1', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this.vCashcount3 == '' || this.vCashcount3 == null || this.vCashcount3 == undefined)) {
            this.toastr.warning('Please select valid Cash Counter 1', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        // if (this._StoreService.myform.valid) {
        if (!this._StoreService.myform.get("StoreId").value) {
            // this.Savebtn = true;
            var m_data = {
                insertStoreMaster: {
                    storeShortName: this._StoreService.myform.get("StoreShortName").value.trim(),
                    storeName: this._StoreService.myform.get("StoreName").value.trim(),
                    indentPrefix: this._StoreService.myform.get("IndentPrefix").value.trim(),
                    indentNo: this._StoreService.myform.get("IndentNo").value,
                    purchasePrefix: this._StoreService.myform.get("PurchasePrefix").value.trim(),
                    purchaseNo: this._StoreService.myform.get("PurchaseNo").value,
                    grnPrefix: this._StoreService.myform.get("GrnPrefix").value.trim(),
                    grnNo: this._StoreService.myform.get("GrnNo").value,
                    grnreturnNoPrefix: this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
                    grnreturnNo: this._StoreService.myform.get("GrnreturnNo").value,
                    issueToDeptPrefix: this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
                    issueToDeptNo: this._StoreService.myform.get("IssueToDeptNo").value,
                    returnFromDeptNoPrefix: this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
                    returnFromDeptNo: this._StoreService.myform.get("ReturnFromDeptNo").value,
                    PharSalCountID: this._StoreService.myform.get("PahsalesCashCounterID").value.CashCounterId || 0,
                    PharSalRecCountID: this._StoreService.myform.get("PahsalesrecCashCounterID").value.CashCounterId || 0,
                    PharSalReturnCountID: this._StoreService.myform.get("PahsalesreturnCashCounterID").value.CashCounterId || 0,
                    DL_NO: 0,//this._StoreService.myform.get("ReturnFromDeptNo").value,
                    GSTIN: 0,// this._StoreService.myform.get("ReturnFromDeptNo").value,
                    Header: this._StoreService.myform.get("Header").value,
                    isDeleted: Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
                    addedBy: 1,
                },
            };
            console.log(m_data);
            this._StoreService.insertStoreMaster(m_data).subscribe((data) => {
                this.msg = data;
                if (data) {
                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    // this.Savebtn = false;
                    this.onClose();
                } else {
                    this.toastr.error('Store-Form Master Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        } else {
            // this.Savebtn = true;
            var m_dataUpdate = {
                updateStoreMaster: {
                    storeId: this._StoreService.myform.get("StoreId").value,
                    storeShortName: this._StoreService.myform.get("StoreShortName").value.trim(),
                    storeName: this._StoreService.myform.get("StoreName").value.trim(),
                    indentPrefix: this._StoreService.myform.get("IndentPrefix").value.trim(),
                    indentNo: this._StoreService.myform.get("IndentNo").value,
                    purchasePrefix: this._StoreService.myform.get("PurchasePrefix").value.trim(),
                    purchaseNo: this._StoreService.myform.get("PurchaseNo").value,
                    grnPrefix: this._StoreService.myform.get("GrnPrefix").value.trim(),
                    grnNo: this._StoreService.myform.get("GrnNo").value,
                    grnreturnNoPrefix: this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
                    grnreturnNo: this._StoreService.myform.get("GrnreturnNo").value,
                    issueToDeptPrefix: this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
                    issueToDeptNo: this._StoreService.myform.get("IssueToDeptNo").value,
                    returnFromDeptNoPrefix: this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
                    returnFromDeptNo: this._StoreService.myform.get("ReturnFromDeptNo").value,
                    isDeleted: Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
                    Header: this._StoreService.myform.get("Header").value,
                    updatedBy: 1,
                },
            };
            console.log(m_dataUpdate);
            this._StoreService.updateStoreMaster(m_dataUpdate).subscribe((data) => {

                if (data) {
                    this.toastr.success('Record updated Successfully.', 'updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    // this.Savebtn = false;
                    this.onClose();
                } else {
                    this.toastr.error('Store-Form Master Master Data not updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }
    // }
    onEdit(row) {

        var m_data = {
            StoreId: row.StoreId,
            StoreShortName: row.StoreShortName.trim(),
            StoreName: row.StoreName.trim(),
            IndentPrefix: row.IndentPrefix.trim(),
            IndentNo: row.IndentNo.trim(),
            PurchasePrefix: row.PurchasePrefix.trim(),
            PurchaseNo: row.PurchaseNo.trim(),
            GrnPrefix: row.GrnPrefix.trim(),
            GrnNo: row.GrnNo.trim(),
            GrnreturnNoPrefix: row.GrnreturnNoPrefix.trim(),
            GrnreturnNo: row.GrnreturnNo.trim(),
            IssueToDeptPrefix: row.IssueToDeptPrefix.trim(),
            IssueToDeptNo: row.IssueToDeptNo.trim(),
            ReturnFromDeptNoPrefix: row.ReturnFromDeptNoPrefix.trim(),
            ReturnFromDeptNo: row.ReturnFromDeptNo.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        this._StoreService.populateForm(m_data);
        console.log(row)
        console.log(m_data)
    }


    setcashCounter: any;

    getCashCountersalesComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList1 = data
            console.log(this.CashCounterList1)
            this.filteredOptionsphsalesCashCounter = this._StoreService.myform.get('PahsalesCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounter1(value) : this.CashCounterList1.slice()),
            );

        });
    }

    private _filterCashCounter1(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList1.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounter1(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }


    getCashCountersalesrecComboList() {

        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList2 = data
            this.filteredOptionsphsalesrecCashCounter = this._StoreService.myform.get('PahsalesrecCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounter2(value) : this.CashCounterList2.slice()),
            );

        });
    }



    private _filterCashCounter2(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList2.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounter2(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }


    getCashCountersalesreturnComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList3 = data
            this.filteredOptionsphsalesreturnCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounter3(value) : this.CashCounterList3.slice()),
            );

        });
    }



    private _filterCashCounter3(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList3.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounter3(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }
    getCashCounterAdvComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList3 = data
            this.filteredOptionsphAdvCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdv(value) : this.CashCounterList3.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdv(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList3.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdv(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }

    getCashCounterAdvReceComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList3 = data
            this.filteredOptionsphAdvRecesCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRece(value) : this.CashCounterList3.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRece(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList3.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRece(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }

    getCashCounterAdvRefundComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList3 = data
            this.filteredOptionsphAdvRefundCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRefund(value) : this.CashCounterList3.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRefund(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList3.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRefund(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }
    getCashCounterAdvRefundReceComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterList3 = data
            this.filteredOptionsphAdvRefRecesCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRefundRece(value) : this.CashCounterList3.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRefundRece(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterList3.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRefundRece(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }



    onClear() {
        this._StoreService.myform.reset();
    }
    onClose() {
        this._StoreService.myform.reset();
        this.dialogRef.close();
    }
}
