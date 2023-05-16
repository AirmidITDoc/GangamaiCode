import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class BedMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createBedForm();
        this.myformSearch = this.createSearchForm();
    }

    createBedForm(): FormGroup {
        return this._formBuilder.group({
            BedId: [""],
            BedName: [""],
            RoomId: [""],
            RoomName: [""],
            IsAvailable: ["1"],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BedNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createBedForm();
    }

    public getbedMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_BedMaster_by_Name",
            { BedName: "%" }
        );
    }

    public getWardMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_rtrv_WardMasterForCombo",
            {}
        );
    }

    public bedMasterInsert(param) {
        return this._httpClient.post("DepartMentMaster/BedSave", param);
    }

    public bedMasterUpdate(param) {
        return this._httpClient.post("DepartMentMaster/BedUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
