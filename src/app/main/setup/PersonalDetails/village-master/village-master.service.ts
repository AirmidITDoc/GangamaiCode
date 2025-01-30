import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class VillageMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myForm = this.createVillageForm();
        this.myformSearch = this.createSearchForm();
    }

    createVillageForm(): FormGroup {
        return this._formBuilder.group({
            villageId: [""],
            villageName: [""],
            talukaId: [""],
            isActive:[true,[Validators.required]]
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

    public stateMasterSave(Param: any) {
        if (Param.villageId) {
            return this._httpClient.PutData("TalukaMaster/" + Param.villageId, Param);
        } else return this._httpClient.PostData("TalukaMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TalukaMaster?Id=" + m_data.toString());
    }

    // public getVillageMasterList(param) {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=Rtrv_VillageNameList_by_Name",param
    //     );
    // }

    // public getTalukaMasterCombo() {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=Retrieve_TalukaMasterForCombo",
    //         {}
    //     );
    // }

    // public villageMasterInsert(param) {
    //     return this._httpClient.post("PersonalDetails/VillageSave", param);
    // }

    // public villageMasterUpdate(param) {
    //     return this._httpClient.post("PersonalDetails/VillageUpdate", param);
    // }

    // populateForm(param) {
    //     this.myForm.patchValue(param);
    // }
}
