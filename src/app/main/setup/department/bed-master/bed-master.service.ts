import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class BedMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        public loaderService: LoaderService
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
            IsAvailable: [true],
            IsDeleted: [true],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
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

    public getbedMasterList(param, loader = true) {
        if (loader) {
            this.loaderService.show();
        }
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_BedMasterList_1",
            param
        );
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }
    public getWardMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_RoomMasterForCombo",
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
