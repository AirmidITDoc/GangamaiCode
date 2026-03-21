import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ReturnFromDepartmentService {


    ReturnSearchGroup: FormGroup;
    NewReturnFinalForm: FormGroup;


    constructor(
        public _httpClient: HttpClient, public _loggedService: AuthenticationService, public _httpClient1: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {

    }

    ReturnSearchFrom() {
        return this._formBuilder.group({
            ToStoreId: '',
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            StoreId: this._loggedService.currentUserValue.storeId,
            ReturnQty: ''
        });
    }
    CreateNewReturnForm() {
        return this._formBuilder.group({
            ToStoreId: '',
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            StoreId: '',
            Remark: '',
            TotalAmount: '',
            TotalvatAmount: '',
            ReturnQty: ['']
        });
    }
    createFinalForm() {
        return this._formBuilder.group({
            Remark: '',
            TotalAmount: '',
            TotalvatAmount: '',
            PurTotalAmount: '',
            LandedTotalAmount: ''
        });
    }


    public getReturnToDepartmentList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReturnToDepartmentList_1", Param);
    }
    public getReturnItemList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=rptReturnFromDepartment", Param);
    }
    public getNewReturnToDepartmentList(Param) {
        return this._httpClient1.PostData("Generic/GetByProc?procName=Retrieve_ReturnToDepartmentIssueList_1", Param);
    }
    public getNewReturnItemList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IssueToDepartmentItemDet_1", Param);
    }
    public getToStoreSearchList() {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
    }
    public getLoggedStoreList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
    }
    public getReturnfromDeptview(ReturnId) {
        return this._httpClient.get("InventoryTransaction/view-ReturnfromDept?ReturnId=" + ReturnId);
    }
    public getReturnfromDeptdatewiseview(FromDate, ToDate, FromStoreId, ToStoreId) {
        return this._httpClient.get("InventoryTransaction/view-ReturnfromDeptDatewise?FromDate=" + FromDate + "&ToDate=" + ToDate + "&FromStoreId=" + FromStoreId + "&ToStoreId=" + ToStoreId);
    }

    public ReturnfromdeptSave(Param) {
        return this._httpClient.post("InventoryTransaction/InsertReturnFromDepartment", Param);
    }

}
