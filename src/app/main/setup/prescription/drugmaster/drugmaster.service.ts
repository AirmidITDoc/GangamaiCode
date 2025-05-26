import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class DrugmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _loadService:LoaderService
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): FormGroup {
        return this._formBuilder.group({
            DrugId: [""],
            DrugName: [""],
            GenericId: [""],
            GenericName: [""],
            ClassId: [""],
            ClassName: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DrugNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDrugForm();
    }

    public getDrugMasterList(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post(
            "Generic/GetByProc?procName=M_RetrieveDrugList",
            param
        );
    }

    // Generic Master Combobox List
    public getGenericMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveGenericMasterForCombo",
            {}
        );
    }

    // Class Master Combobox List
    public getClassMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_RetrieveClassMasterForCombo",
            {}
        );
    }

    public insertDrugMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/DrugSave", param);
    }

    public updateDrugMaster(param,loader = true) {
        if(loader){
            this._loadService.show()
        }
        return this._httpClient.post("Prescription/DrugUpdate", param);
    }
  public deactivateTheStatus(param, loader = true) {
    if(loader){
      this._loadService.show()
    } 
        return this._httpClient.post( "Generic/ExecByQueryStatement?query=" + param, {} );
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
