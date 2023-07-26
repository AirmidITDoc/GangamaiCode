import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createWardForm();
        this.myformSearch = this.createSearchForm();
    }

    createWardForm(): FormGroup {
        return this._formBuilder.group({
            RoomId: [""],
            RoomName: [""],
            LocationId: [""],
            LocationName: [""],
            ClassId: [""],
            ClassName: [""],
            RoomType: ["1"],
            IsAvailable: ["false"],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RoomNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createWardForm();
    }

    public getwardMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_WardMaster_by_Name",
            param
        );
    }

    public getLocationMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveLocationMasterForCombo",
            {}
        );
    }

    public getClassMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveClassMasterForCombo",
            {}
        );
    }

    public wardMasterInsert(param) {
        return this._httpClient.post("DepartMentMaster/WardSave", param);
    }

    public wardMasterUpdate(param) {
        return this._httpClient.post("DepartMentMaster/WardUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
