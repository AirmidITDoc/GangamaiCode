
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup } from "@angular/forms";
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
    numericform: FormGroup;

    is_numeric : Boolean = true;
    descriptiveList = [];
    numericList = [];


    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loaderService: LoaderService,
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createParameterForm();
        this.descform=this.descForm();
        this.formulaform=this.createformulaForm();
        this.numericform = this.numericForm();
    }


    createParameterForm(): FormGroup {
        return this._formBuilder.group({
            parameterId: [0],
            parameterShortName: [
                "",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z ]*$")
                ],
            ],
            parameterName: [
                "",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z ]*$")
                ],
            ],
            
            printParameterName: [
                "",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z ]*$")
                ],
            ],
            unitId: ["",
                // Validators.required
            ],
            isNumeric: ["1"],
            isPrintDisSummary: true,
            IsBold:['0'],
            IsDeleted: ["true"],
            MethodName: ["",
                // [Validators.pattern("^[A-Za-z ]*$")],
            ],
            Formula:[""],
        });
    }

    numericForm():FormGroup{
        return this._formBuilder.group({
            pathparaRangeId: 0,
            paraId: 0,
            sexId: "",
            minValue: [""],
            maxvalue: [""],
            minAge:[""],
            maxAge:[""],
            ageType:[""]
        });
    }

    descForm():FormGroup{
        return this._formBuilder.group({
            descriptiveId: 0,
            paraId: 0,
            parameterValues: ["", 
                // Validators.required
            ],
            isDefaultValue: true,
            defaultValue: ["", 
                // Validators.required
            ]
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
            ParameterId:[""],
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
    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.DeleteData("PathCategoryMaster?Id=" + m_data.toString());
    // }

    public insertParameterMaster(Param: any) {
        // if (Param.parameterId) {
        //     return this._httpClient.PutData("ParameterMaster/Edit/" + Param.parameterId, Param);
        // } else 
        
        return this._httpClient.PostData("ParameterMaster/InsertEDMX", Param);
    }

    public update1ParameterMaster(Param: any) {
        debugger
        if (Param.parameterId) {
            return this._httpClient.PutData("ParameterMaster/Edit/" + Param.parameterId, Param);
        }        
    }

    public updateParameterMaster(param) {
        return this._httpClient.PostData("PathologyMaster/ParameterAgeWiseMasterUpdate", param);
    }

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

    public getTableData(param){
        if(this.is_numeric) {
            return this._httpClient.PostData(
                "Generic/GetByProc?procName=m_Rtrv_PathParameterRangeWithAge",
                { parameterId: param }
            ); 
        }
        else{
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_PathDescriptiveValues_1",
            { parameterId: param }
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
        ;
        this.myform.patchValue(param);
        this.myform.get("IsPrintDisSummary").setValue(param.IsPrintDisSummary == "false" ? false : true);
        this.myform.get("IsNumeric").setValue(param.IsNumeric == 1? 1: 2);
        this.is_numeric = param.IsNumeric == 1? true : false;
        this.numericList = param.numericList;
        this.descriptiveList = param.descriptiveList;
    }
}
