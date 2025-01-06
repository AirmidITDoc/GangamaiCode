import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class VillageMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myForm = this.createVillageForm();
        this.myformSearch = this.createSearchForm();
    }

    createVillageForm(): FormGroup {
        return this._formBuilder.group({
            VillageId: [""],
            VillageName: [""],
            TalukaName: [""],
            TalukaId: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            VillageNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createVillageForm();
    }

    public getVillageMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_VillageNameList_by_Name",param
        );
    }

    public getTalukaMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_TalukaMasterForCombo",
            {}
        );
    }

    public villageMasterInsert(param) {
        return this._httpClient.post("PersonalDetails/VillageSave", param);
    }

    public villageMasterUpdate(param) {
        return this._httpClient.post("PersonalDetails/VillageUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
