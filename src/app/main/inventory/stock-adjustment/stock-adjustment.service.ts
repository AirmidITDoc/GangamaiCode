import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class StockAdjustmentService {

    userFormGroup: FormGroup;
    StoreFrom: FormGroup;
    MRPAdjform: FormGroup;
    GSTAdjustment: FormGroup;

    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller, private accountService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService, private toastr: ToastrService

    ) {
        this.StoreFrom = this.CreateStoreFrom();
        this.userFormGroup = this.createUserForm();
        this.MRPAdjform = this.createMRPAdjForm();
        // this.GSTAdjustment = this.createGSTForm();
        this.MRPAdjform.markAllAsTouched();

    }
    CreateStoreFrom() {
        return this._formBuilder.group({
            StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ItemID: [''],
            batchEdit: [''],
            expDateEdit: ''
        });
    }
    createUserForm() {
        return this._formBuilder.group({
            ItemID: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            BatchEdit: [''],
            ExpDate: ['', [Validators.required]],
        });
    }
    createMRPAdjForm() {
        return this._formBuilder.group({
            OldMRP: ['', [Validators.min(0)]],
            LandedRate: ['', [Validators.min(0)]],
            PurchaseRate: ['', [Validators.min(0)]],
            ConversionFactor: [0, [Validators.min(0)]],
            NewMRP: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            newLandedRate: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            NewPurchaseRate: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],

        });
    }
    // createGSTForm() {
    //   return this._formBuilder.group({
    //     CGSTPer: [0, [Validators.min(0)]],
    //     SGSTPer: [0, [Validators.min(0)]],
    //     IGSTPer: [0, [Validators.min(0)]],
    //     NewCGSTPer: [0, [Validators.min(0),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    //     NewSGSTPer: [0, [Validators.min(0),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    //     NewIGSTPer: [0, [Validators.min(0),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    //     TotalGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    //     OldTotalGSTPer: [0, [Validators.min(0)]],
    //   });
    // }

    createExpForm() {
        return this._formBuilder.group({
            NewexpDate: ['', [Validators.required]],
            OldexpDate: [''],
        });
    }

    public getStockList(Param) {//Retrieve_BatchNoForMrpAdj
        return this._httpClient1.PostData("StockAdjustment/ItemWiseStockList", Param);
    }
    public getLoggedStoreList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
    }
    public getItemlist(Param) {//m_Rtrv_ItemMasterForCombo
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName", Param)
    }
    public StockAdjSave(param) {
        return this._httpClient1.PostData('InventoryTransaction/StockAdjustment', param);
    }
    public BatchAdjSave(param) {//InventoryTransaction/BatchAdjustmen
        return this._httpClient1.PostData('StockAdjustment/BatchUpdate', param);
    }
    public MRPAdjSave(param) {
        return this._httpClient1.PostData('StockAdjustment/MrpAdjustmentUpdate', param);
    }
    public GSTAdjSave(param) {
        return this._httpClient1.PostData('StockAdjustment/GSTUpdate', param);
    }
    public StckupdateSave(param) {//InventoryTransaction/BatchAdjustmen
        return this._httpClient1.PostData('StockAdjustment/StockUpdate', param);
    }

    // NewApi
    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("BedMaster", m_data);
    }

    showToast(message: string, type: ToastType = ToastType.SUCCESS) {
        if (type === ToastType.SUCCESS) {
            this.toastr.success(message, `${type} !`, {
                toastClass: `tostr-tost custom-toast-${ToastType.SUCCESS}`,
            });
        }

        if (type === ToastType.WARNING) {
            this.toastr.warning(message, `${type} !`, {
                toastClass: `tostr-tost custom-toast-${ToastType.WARNING}`,
            });
        }
        if (type === ToastType.ERROR) {
            this.toastr.error(message, `${type} !`, {
                toastClass: `tostr-tost custom-toast-${ToastType.ERROR}`,
            });
        }

    }
}
