import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
                public loaderService: LoaderService
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
            IsAvailable: [true],
            IsDeleted: [true],
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

    public getwardMasterList(param, loader=true) {
        if (loader) {
            this.loaderService.show();
        }
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_WardMasterList",
            param
        );
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
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
