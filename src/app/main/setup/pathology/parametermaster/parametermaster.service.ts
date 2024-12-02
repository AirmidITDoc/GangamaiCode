import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ParametermasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    descform: FormGroup;
    formulaform: FormGroup;
    is_numeric : Boolean = true;
    descriptiveList = [];
    numericList = [];


    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder,
        private _loaderService: LoaderService,
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createParameterForm();
        this.descform=this.getmydescform();
        this.formulaform=this.createformulaForm();
        
    }

    createParameterForm(): FormGroup {
        return this._formBuilder.group({
            ParameterID: [""],
            ParameterName: [
                "",
                [Validators.required,Validators.pattern("^[A-Za-z ]*$")],
            ],
            ParameterShortName: [
                "",
                [Validators.required,Validators.pattern("^[A-Za-z ]*$")],
            ],
            PrintParameterName: [
                "",
                [Validators.required,Validators.pattern("^[A-Za-z ]*$")],
            ],
            MethodName: ["",
             [Validators.pattern("^[A-Za-z ]*$")],
            ],
            UnitId: [""],
            UnitName: [""],
            IsNumeric: ["1"],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            IsPrintDisSummary: [],
            ParaMultipleRange: [""],
            PathparaRangeId: [""],
            ParaId: [""],
            SexId: [""],
            IsDescriptive: [""],
            DefaultValue: ["", [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],
            parameterValues: ["", [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],
            IsDefaultValue: [""],
            SexID:[""],
            MinAge:[""],
            MaxAge: [""],
            MinValue: [""],
            MaxValue: [""],
            AgeType: [""],
            Formula:[""],
            IsBold:['0']
        });
    }

    getmydescform():FormGroup{
        return this._formBuilder.group({
            DefaultValue: [""],
            ParaId: [""],
            // IsDeletedSearch: ["2"],
        });
    }

    createSearchForm():FormGroup{
        return this._formBuilder.group({
            ParameterNameSearch: [""],
            IsDeletedSearch: ["1"],
        });
    }

    createformulaForm():FormGroup{
        return this._formBuilder.group({
            ParameterNameSearch: [""],
            Formula: [""],
            ParameterID:[""],
            Formulapara:[""],
            OPrator:[""],
            parameterName:[""],
          
        });
    }

    public getStateList(CityId,loader = true) {
      
        return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
      }

    initializeFormGroup() {
        this.createParameterForm();
    }

    //parameter detail
    public getParameterMasterList(m_data,loader = true) { 
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PathParameterMaster_by_Name",
            m_data);
    }
     // Unit Master Combobox List
     public getUnitMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_UnitMasterForCombo",{});
    }
     // Gender Master Combobox List
   

    public getGenderMasterCombo() { 
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_GenderMasterForCombo",{});
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData(
            "Generic/ExecByQueryStatement?query=" + m_data, {});
    }

    public insertParameterMaster(Param: any, showLoader = true) {
        if (Param.ParameterID) {
            return this._httpClient.PutData("PathParameterMaster/" + Param.ParameterID, Param, showLoader);
        } else 
        
        return this._httpClient.PostData("PathParameterMaster", Param, showLoader);
    }

    public updateParameterMaster(param) {
        return this._httpClient.PostData("PathologyMaster/ParameterAgeWiseMasterUpdate", param);
    }

    //detail of Range Master

    // public getParameteragewiseMasterList() {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=ps_Rtrv_PathParameteragewiseMaster",
    //         { ParameterName: "" }
    //     );
    // }

    // Gender Master Combobox List
    public getParameterMaster1Combo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Rtrv_PathParameterList_by_Name",
            {}
        );
    }

   

    public deleteAssignParameterToRange(param) {
        return this._httpClient.PostData("Pathology/ParameterUpdate", param);
    }

    // public getNumericMasterItem(param){
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=Rtrv_PathParameterRangeWithAge",
    //         { ParameterID: param }
    //     ); 
    // }
    public getTableData(param){
        if(this.is_numeric) {
            return this._httpClient.PostData(
                "Generic/GetByProc?procName=m_Rtrv_PathParameterRangeWithAge",
                { ParameterID: param }
            ); 
        }
        else{
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_PathDescriptiveValues_1",
            { ParameterID: param }
        ); 
    }
    }

    //Descriptive

    public getDescriptiveMasterList() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_PathParameterDescriptiveMaster_by_Name",
            { ParameterName: "%" }
        );
    }

    public InsertParameterRangeMaster(param) {
        return this._httpClient.PostData("ParameterAgeWiseMasterSave", param);
    }

    public getParameterMasterCombo(param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PathParameterList_by_Name",param );
    }
    public getParameterMasterforformulaList(param,loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.PostData("Generic/GetByProc?procName=m_rtrv_PathParaformulaList_by_Name",param );
    }
    

    public deleteAssignParameterToDescriptive(param) {
        return this._httpClient.PostData("Pathology/ParameterUpdate", param);
    }

    public insertDescriptiveMaster(param) {
        return this._httpClient.PostData("Pathology/DescriptiveSave", param);
    }

    populateForm(param) {
        debugger;
        this.myform.patchValue(param);
        this.myform.get("IsPrintDisSummary").setValue(param.IsPrintDisSummary == "false" ? false : true);
        this.myform.get("IsNumeric").setValue(param.IsNumeric == 1? 1: 2);
        this.is_numeric = param.IsNumeric == 1? true : false;
        this.numericList = param.numericList;
        this.descriptiveList = param.descriptiveList;
    //    if (this.descriptiveList[0]?.DefaultValue) this.myform.get("DefaultValue").setValue(this.descriptiveList[0]?.DefaultValue);
        
}
}
