
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { ToastType } from '../good-receiptnote/new-grn/types';

@Injectable({
    providedIn: 'root'
})

export class OpeningBalanceService {
    StoreForm: FormGroup;
    UseFormGroup: FormGroup;
    NewUseForm: FormGroup;
    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller, private accountService: AuthenticationService,
        public _formbuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
        private toastr: ToastrService,
    ) { }
    CreateStorForm() {
        return this._formbuilder.group({
            StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
        })
    }
    createsearchFormGroup() {
        return this._formbuilder.group({
            startdate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            ToStoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        })
    }

    createNewItemForm() {
        return this._formbuilder.group({
            ItemName: ['', [Validators.required]],
            BatchNo: ['', [Validators.required, Validators.maxLength(50)]],
            ExpDate: [''],//['',this._FormvalidationserviceService.validDateValidator()],
            CGST: [''],
            SGST: [''],
            IGST: [''],
            GST: [''],
            MRP: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RatePerUnit: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Remark: [''],
            LandedRate: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            pack: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            stripQty: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalQty: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        })
    }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
    }

    public getLoggedStoreList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
    }
    public getItemNameList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
    }
    public getOpeningBalList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemList", Param);
    }
    public getOpeningBalItemDetList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemDet", Param);
    }

    public InsertOpeningBalSave(Param) {
        return this._httpClient1.PostData("OpeningBalance/OpeningBalanceSave", Param)
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