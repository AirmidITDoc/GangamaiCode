import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
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
            IsAvailable: ["1"],
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

  
    populateForm(Param) {
        this.myform.patchValue(Param);
    }



    public getWardMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("WardMaster/List", param, showLoader);
    }

    publicWardMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Ward", Param, showLoader);
    }

    public WardMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Ward", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Ward", m_data);
    }
}
