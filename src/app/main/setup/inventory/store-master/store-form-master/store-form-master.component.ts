import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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
    vMobileNo:any;
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
    vCashcountAdvRefReceipt:any;
    

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
        this.getCashCounterAdvComboList();
        this.getCashCounterAdvReceComboList();
        this.getCashCounterAdvRefundComboList(); 
        this.getCashCounterAdvRefundReceComboList(); 
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
    CashCounterAdv:any = [];
    getCashCounterAdvComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterAdv = data
            this.filteredOptionsphAdvCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdv(value) : this.CashCounterAdv.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdv(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterAdv.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdv(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }
    CashCounterAdvRece:any=[];
    getCashCounterAdvReceComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterAdvRece = data
            this.filteredOptionsphAdvRecesCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRece(value) : this.CashCounterAdvRece.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRece(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterAdvRece.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRece(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }
    CashCounterAdvRef:any=[];
    getCashCounterAdvRefundComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterAdvRef = data
            this.filteredOptionsphAdvRefundCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRefund(value) : this.CashCounterAdvRef.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRefund(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterAdvRef.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRefund(option) {
        if (!option)
            return '';
        return option.CashCounterName;
    }
    CashCounterAdvRefRece:any=[];
    getCashCounterAdvRefundReceComboList() {
        this._StoreService.getCashcounterList().subscribe(data => {
            this.CashCounterAdvRefRece = data
            this.filteredOptionsphAdvRefRecesCashCounter = this._StoreService.myform.get('PahsalesreturnCashCounterID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCashCounterAdvRefundRece(value) : this.CashCounterAdvRefRece.slice()),
            ); 
        });
    } 
    private _filterCashCounterAdvRefundRece(value: any): string[] {
        if (value) {
            const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
            return this.CashCounterAdvRefRece.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
        }
    }
    getOptionTextCashCounterAdvRefundRece(option) {
        if (!option)
            return '';
        return option.CashCounterName;
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
            this.toastr.warning('Please select  Phar sales Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if(this._StoreService.myform.get('PahsalesCashCounterID').value){
            if(!this.CashCounterList1.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahsalesCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar sales Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vCashcount2 == '' || this.vCashcount2 == null || this.vCashcount2 == undefined)) {
            this.toastr.warning('Please select Phar sales Receipt Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('PahsalesrecCashCounterID').value){
            if(!this.CashCounterList2.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahsalesrecCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar sales Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vCashcount3 == '' || this.vCashcount3 == null || this.vCashcount3 == undefined)) {
            this.toastr.warning('Please select Phar sales Return Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('PahsalesreturnCashCounterID').value){
            if(!this.CashCounterList3.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahsalesreturnCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar sales Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vAdvCashcount == '' || this.vAdvCashcount == null || this.vAdvCashcount == undefined)) {
            this.toastr.warning('Please select valid Phar Advance Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('PahAdvCashCounterID').value){
            if(!this.CashCounterAdv.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahAdvCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar Advance Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vCashcountAdvReceipt == '' || this.vCashcountAdvReceipt == null || this.vCashcountAdvReceipt == undefined)) {
            this.toastr.warning('Please select Phar Advance Receipt Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('PahAdvReceiCashCounterID').value){
            if(!this.CashCounterAdvRece.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahAdvReceiCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar Advance Receipt Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vCashcountAdvRefund == '' || this.vCashcountAdvRefund == null || this.vCashcountAdvRefund == undefined)) {
            this.toastr.warning('Please select Advance Refund Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('vCashcountAdvRefund').value){
            if(!this.CashCounterAdvRef.filter(item=> item.CashCounterId == this._StoreService.myform.get('vCashcountAdvRefund').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar Advance Refund Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }

        if ((this.vCashcountAdvRefReceipt == '' || this.vCashcountAdvRefReceipt == null || this.vCashcountAdvRefReceipt == undefined)) {
            this.toastr.warning('Please select Advance Refund Receipt Cash Counter', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if(this._StoreService.myform.get('PahAdvRefundReceiCashCounterID').value){
            if(!this.CashCounterAdvRefRece.filter(item=> item.CashCounterId == this._StoreService.myform.get('PahAdvRefundReceiCashCounterID').value.CashCounterId)){
                this.toastr.warning('Please select valid Phar Advance Refund Receipt Cash Counter', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } 
        }
        // if (this._StoreService.myform.valid) {
        if (!this._StoreService.myform.get("StoreId").value) {
           
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
                    pharAdvId: this._StoreService.myform.get("PahAdvCashCounterID").value.CashCounterId || 0,
                    pharAdvReptId: this._StoreService.myform.get("PahAdvReceiCashCounterID").value.CashCounterId || 0,
                    pharAdvRefId: this._StoreService.myform.get("PahAdvRefundCashCounterID").value.CashCounterId || 0,
                    pharAdvRefReptId: this._StoreService.myform.get("PahAdvRefundReceiCashCounterID").value.CashCounterId || 0,
                    printStoreName: this._StoreService.myform.get("PrintStoreName").value || '',
                    storeAddress: this._StoreService.myform.get("PrintStoreAddress").value || '',
                    hospitalMobileNo: this._StoreService.myform.get("MobileNo").value || 0,
                    termsAndCondition: this._StoreService.myform.get("PrintTermsCondition").value || '' 
                }, 
            };
            console.log(m_data);
            this._StoreService.insertStoreMaster(m_data).subscribe((data) => {
                this.msg = data;
                if (data) {
                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    }); 
                    this.onClose();
                } else {
                    this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        } else { 
            var m_dataUpdate = {
                updateStoreMaster: {
                    storeId: this._StoreService.myform.get("StoreId").value,
                    storeShortName: this._StoreService.myform.get("StoreShortName").value.trim(),
                    storeName: this._StoreService.myform.get("StoreName").value.trim(),
                    // indentPrefix: this._StoreService.myform.get("IndentPrefix").value.trim(),
                    // indentNo: this._StoreService.myform.get("IndentNo").value,
                    // purchasePrefix: this._StoreService.myform.get("PurchasePrefix").value.trim(),
                    // purchaseNo: this._StoreService.myform.get("PurchaseNo").value,
                    // grnPrefix: this._StoreService.myform.get("GrnPrefix").value.trim(),
                    // grnNo: this._StoreService.myform.get("GrnNo").value,
                    // grnreturnNoPrefix: this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
                    // grnreturnNo: this._StoreService.myform.get("GrnreturnNo").value,
                    // issueToDeptPrefix: this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
                    // issueToDeptNo: this._StoreService.myform.get("IssueToDeptNo").value,
                    // returnFromDeptNoPrefix: this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
                    // returnFromDeptNo: this._StoreService.myform.get("ReturnFromDeptNo").value,  
                    PharSalCountID: this._StoreService.myform.get("PahsalesCashCounterID").value.CashCounterId || 0,
                    PharSalRecCountID: this._StoreService.myform.get("PahsalesrecCashCounterID").value.CashCounterId || 0,
                    PharSalReturnCountID: this._StoreService.myform.get("PahsalesreturnCashCounterID").value.CashCounterId || 0,
                    pharAdvId: this._StoreService.myform.get("PahAdvCashCounterID").value.CashCounterId || 0,
                    pharAdvReptId: this._StoreService.myform.get("PahAdvReceiCashCounterID").value.CashCounterId || 0,
                    pharAdvRefId: this._StoreService.myform.get("PahAdvRefundCashCounterID").value.CashCounterId || 0,
                    pharAdvRefReptId: this._StoreService.myform.get("PahAdvRefundReceiCashCounterID").value.CashCounterId || 0,
                    printStoreName: this._StoreService.myform.get("PrintStoreName").value || '',
                    DL_NO: 0,//this._StoreService.myform.get("ReturnFromDeptNo").value,
                    GSTIN: 0,// this._StoreService.myform.get("ReturnFromDeptNo").value,
                    storeAddress: this._StoreService.myform.get("PrintStoreAddress").value || '',
                    hospitalMobileNo: this._StoreService.myform.get("MobileNo").value || '',
                    hospitalEmailId: 0,
                    printStoreUnitName: '', 
                    isPharStore: 0,
                    isWhatsAppMsg: 0,
                    whatsAppTemplateId: '',
                    smsTemplateId: 0, 
                    isDeleted: Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
                    Header: this._StoreService.myform.get("Header").value,
                    termsAndCondition: this._StoreService.myform.get("PrintTermsCondition").value || '',
                    updatedBy: 1
                },
            };
            console.log(m_dataUpdate);
            this._StoreService.updateStoreMaster(m_dataUpdate).subscribe((data) => { 
                if (data) {
                    this.toastr.success('Record updated Successfully.', 'updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    }); 
                    this.onClose();
                } else {
                    this.toastr.error('Record Data not updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    } 
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
    onClear() {
        this._StoreService.myform.reset();
    }
    onClose() {
        this._StoreService.myform.reset();
        this.dialogRef.close();
    }

    focusNext(nextElementId: string): void {
        const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
        if (nextElement) {
            nextElement.focus();
        }
    } 


        @ViewChild('StoreName') StoreName: ElementRef;
        @ViewChild('MobileNo') MobileNo: ElementRef;
        @ViewChild('PrintStoreName') PrintStoreName: ElementRef;
        @ViewChild('PrintStoreAddress') PrintStoreAddress: ElementRef;
        @ViewChild('PrintTermsCondition') PrintTermsCondition: ElementRef;
        @ViewChild('IndentPrefix') IndentPrefix: ElementRef;

        @ViewChild('IndentNo') IndentNo: ElementRef;
        @ViewChild('GrnreturnNoPrefix') GrnreturnNoPrefix: ElementRef;
        @ViewChild('GrnreturnNo') GrnreturnNo: ElementRef;
        @ViewChild('PurchasePrefix') PurchasePrefix: ElementRef;
        @ViewChild('PurchaseNo') PurchaseNo: ElementRef;
        @ViewChild('IssueToDeptPrefix') IssueToDeptPrefix: ElementRef;


        @ViewChild('GrnPrefix') GrnPrefix: ElementRef;
        @ViewChild('IssueToDeptNo') IssueToDeptNo: ElementRef;
        @ViewChild('GrnNo') GrnNo: ElementRef;

        @ViewChild('ReturnFromDeptNoPrefix') ReturnFromDeptNoPrefix: ElementRef;
        @ViewChild('ReturnFromDeptNo') ReturnFromDeptNo: ElementRef;
        
    public onEnterStoreShortName(event): void {
        if (event.which === 13) {
            this.StoreName.nativeElement.focus(); 
        }
    } 
    public onEnterShortName(event): void {
        if (event.which === 13) {
            this.MobileNo.nativeElement.focus();  
        }
    }
    public onEnterMobileNo(event): void {
        if (event.which === 13) {
            this.PrintStoreName.nativeElement.focus();
        }
    }
    public onEnterPrintStoreName(event): void {
        if (event.which === 13) {
            this.PrintStoreAddress.nativeElement.focus();
        }
    }
    public onEnterPrintStoreAddress(event): void {
        if (event.which === 13) {
            this.PrintTermsCondition.nativeElement.focus();
        }
    }
    public onEnterPrintTermsCondition(event): void {
        if (event.which === 13) {
            this.IndentPrefix.nativeElement.focus();
        }
    }
    public onEnterIndentPrefix(event): void {
        if (event.which === 13) {
            this.IndentNo.nativeElement.focus();
        }
    }
    public onEnterIndentNo(event): void {
        if (event.which === 13) {
            this.GrnreturnNoPrefix.nativeElement.focus();
        }
    }
    public onEnterGrnreturnNoPrefix(event): void {
        if (event.which === 13) {
            this.GrnreturnNo.nativeElement.focus();
        }
    }
    public onEnterGrnreturnNo(event): void {
        if (event.which === 13) {
            this.PurchasePrefix.nativeElement.focus();
        }
    }
    public onEnterPurchasePrefix(event): void {
        if (event.which === 13) {
            this.PurchaseNo.nativeElement.focus();
        }
    }

    public onEnterPurchaseNo(event): void {
        if (event.which === 13) {
            this.IssueToDeptPrefix.nativeElement.focus();
        }
    }
    public onEnterIssueToDeptPrefix(event): void {
        if (event.which === 13) {
            this.IssueToDeptNo.nativeElement.focus();
        }
    }
    public onEnterIssueToDeptNo(event): void {
        if (event.which === 13) {
            this.GrnPrefix.nativeElement.focus();
        }
    }
    public onEnterGrnPrefix(event): void {
        if (event.which === 13) {
            this.GrnNo.nativeElement.focus();
        }
    }

    public onEnterGrnNo(event): void {
        if (event.which === 13) {
            this.ReturnFromDeptNoPrefix.nativeElement.focus();
        }
    }
    public onEnterReturnFromDeptNoPrefix(event): void {
        if (event.which === 13) {
            this.ReturnFromDeptNo.nativeElement.focus();
        }
    }
    public onEnterReturnFromDeptNo(event): void {
        if (event.which === 13) {
            this.CashCounterName1.nativeElement.focus();
        }
    }
       @ViewChild('CashCounterName1') CashCounterName1: ElementRef; 
        @ViewChild('CashCounterName2') CashCounterName2: ElementRef;
        @ViewChild('CashCounterName3') CashCounterName3: ElementRef;
        @ViewChild('PahAdvCashCounterID') PahAdvCashCounterID: ElementRef; 
        @ViewChild('PahAdvReceiCashCounterID') PahAdvReceiCashCounterID: ElementRef;
        @ViewChild('PahAdvRefundCashCounterID') PahAdvRefundCashCounterID: ElementRef; 
        @ViewChild('PahAdvRefundReceiCashCounterID') PahAdvRefundReceiCashCounterID: ElementRef;



        public onEnterCashCounterName1(event): void {
            if (event.which === 13) {
                this.CashCounterName2.nativeElement.focus();
            }
        }
        public onEnterCashCounterName2(event): void {
            if (event.which === 13) {
                this.CashCounterName3.nativeElement.focus();
            }
        }
        public onEnterCashCounterName3(event): void {
            if (event.which === 13) {
                this.PahAdvCashCounterID.nativeElement.focus();
            }
        }
        public onEnterPahAdvCashCounterID(event): void {
            if (event.which === 13) {
                this.PahAdvReceiCashCounterID.nativeElement.focus();
            }
        }
        public onEnterPahAdvReceiCashCounterID(event): void {
            if (event.which === 13) {
                this.PahAdvRefundCashCounterID.nativeElement.focus();
            }
        }
        public onEnterPahAdvRefundCashCounterID(event): void {
            if (event.which === 13) {
                this.PahAdvRefundReceiCashCounterID.nativeElement.focus();
            }
        }

}
