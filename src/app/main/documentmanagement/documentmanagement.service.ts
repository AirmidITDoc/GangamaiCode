import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class DocumentmanagementService {
    categoryForm: FormGroup;

    constructor(
        public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
    ) {
        this.categoryForm = this.createCategoryFrom()
    }
    createCategoryFrom() {
        return this._frombuilder.group({
            id: 0,
            parentId: null,
            docCategory: ['', [Validators.required]],
            icon: '',
            sortOrder: null
        })
    }
    public getCategoryTree() {
        return this._httpClient.GetData("DocumentCategory/List");
    }
    public saveCategory(Param) {
        if (Param.id > 0)
            return this._httpClient.PutData("DocumentCategory/" + Param.id, Param);
        else
            return this._httpClient.PostData("DocumentCategory/", Param);
    }
    public getCategory(id) {
        return this._httpClient.GetData("DocumentCategory/" + id);
    }
    public getItemTable1ListData(Param) {
        return this._httpClient.GetData("CanteenRequest/GetItemListforCanteen?ItemName=" + Param);
    }


    public canteenrequestSave(employee) {
        return this._httpClient.PostData("CanteenRequest/Insert", employee);
    }
    public getBillList(Param) {
        return this._httpClient.PostData("CanteenRequest/CanteenRequestHeaderList", Param);
    }
    public getBillDetailsList(Param) {
        return this._httpClient.PostData("CanteenRequest/CanteenRequestList", Param);
    }
    public getNursingBill(Param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_CanteenRequestListFromWard", Param);
    }

    public getItemLatestList(Param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_CanteenRequestListFromWard", Param);
    }

    public canteenBillSave(employee) {
        return this._httpClient.PostData("CanteenBill/Insert", employee);
    }
    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }

    public BillCancle(Param) {
        return this._httpClient.PostData("CanteenBill/Cancel", Param)
    }


}
