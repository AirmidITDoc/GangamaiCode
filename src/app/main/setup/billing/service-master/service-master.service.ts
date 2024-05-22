import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ServiceMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    edit_data = {};
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createServicemasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createServicemasterForm(): FormGroup {
        return this._formBuilder.group({
            ServiceId: [""],
            GroupId: [""],
            GroupName: [""],
            ServiceShortDesc: [""],
            ServiceName: [""],
            Price: ["", Validators.pattern("[0-9]+")],
            IsEditable: ["0"],
            CreditedtoDoctor: ["0"],
            IsPathology: ["0"],
            IsRadiology: ["0"],
            IsDeleted: ["0"],
            PrintOrder: ["", Validators.pattern("[0-9]+")],
            IsPackage: ["0"],
            SubGroupId: [""],
            DoctorId: [""],
            FirstName: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            IsEmergency: ["0"],
            EmgAmt: ["", Validators.pattern("[0-9]+")],
            EmgPer: ["", Validators.pattern("[0-9]+")],
            IsDocEditable: ["0"],
            AddedBy: [""],
            UpdatedBy: [""],
            IsActive:true,
            ServiceDetailId: [""],
            TariffId: [""],
            ClassId: ["0"],
            ClassRate: ["0"],
            EffectiveDate: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createServicemasterForm();
    }

    public getServiceMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_ServList", param
        );
    }

    public getServiceMasterList_Pagn(Param) {
        return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_ServiceList_Pagn", Param);
      }

    public getGroupMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_GroupMasterForCombo", {}
        );
    }

    public getDoctorMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_DoctorMasterForCombo", {}
        );
    }

    public getSubgroupMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_M_SubGroupMasterForCombo ", {}
        );
    }
    public getTariffMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveTariffMasterForCombo", {}
        );
    }

    public getClassMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveClassMasterForCombo",{}
        );
    }

    public serviceMasterInsert(param) {
        return this._httpClient.post("Billing/ServiceSave", param);
    }

    public serviceMasterUpdate(param) {
        return this._httpClient.post("Billing/ServiceUpdate", param);
    }

    public serviceDetailInsert(param) {
        return this._httpClient.post("Billing/ServiceSave", param);
    }

    public serviceDetDelete(param) {
        return this._httpClient.post("Billing/ServiceUpdate", param);
    }

    populateForm(param) {
        debugger;
        this.myform.patchValue(param);
        this.edit_data = param;
        this.myform.get("IsPathology").setValue(param.IsPathology == "1" ? true : false);
        this.myform.get("IsRadiology").setValue(param.IsRadiology == "1" ? true : false);
        this.myform.get("CreditedtoDoctor").setValue(param.CreditedtoDoctor == "true" ? true : false);
        this.myform.get("IsEditable").setValue(param.IsEditable == "true" ? true : false);
        this.myform.get("IsEmergency").setValue(param.IsEmergency == "true" ? true : false);
    }
}
