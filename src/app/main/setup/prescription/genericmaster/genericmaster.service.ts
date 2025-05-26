import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class GenericmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
                private _loadService:LoaderService
    ) {
        this.myForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): FormGroup {
        return this._formBuilder.group({
            GenericId: [""],
            GenericName: [""],

            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGenericForm();
    }

    public getGenericMasterList(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_M_GenericMaster",
            param
        );
    }

    public insertGenericMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/GenericSave", param);
    }

    public updateGenericMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/GenericUpdate", param);
    }
    public deactivateTheStatus(param, loader = true) {
    if(loader){
      this._loadService.show()
    } 
        return this._httpClient.post( "Generic/ExecByQueryStatement?query=" + param, {} );
    }
    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
