import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class MaterialReceivedFromDepartmentService {
    userFormGroup: FormGroup;
    MaterialReturnFrDept: FormGroup;


    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,
    ) {
        this.userFormGroup = this.IndentID();
        this.MaterialReturnFrDept = this.MaterialSearchFrom();
    }

    MaterialSearchFrom() {
        return this._formBuilder.group({
            ToStoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            IsVerify: [0],
            // IsAccepted:[0]
        });
    }

    IndentID() {
        return this._formBuilder.group({
            RoleId: '',
            RoleName: '',
            AdmDate: '',
            Date: '',
            StoreName: '',
            PreNo: '',
            IsActive: '',
        });
    }

    public getIssuetodeptlist(Param) {//m_Rtrv_ReceiveIssueToDep_list_by_Name 
        return this._httpClient1.PostData("IssueToDepartment/AcceptIssueItemDetList", Param);
    }

    public getAccItemdetailList(Param) {
        return this._httpClient1.PostData("IssueToDepartment/AcceptIssueItemDetList", Param);

    }
    public getItemDetList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_IssueItemList", Param);
    }

    public AcceptmaterialSave(Param) {
        return this._httpClient1.PostData("IssueToDepartment/UpdateMaterialAcceptance", Param);
    }

    public getMaterialreceivedfrDeptview(IssueId) {
        return this._httpClient.get("Pharmacy/view-MaterialRecivedFrDept_Report?IssueId=" + IssueId);
    }

}
