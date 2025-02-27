
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
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

    createformulaForm(): FormGroup {
        return this._formBuilder.group({
            formulaId: [0],  // Ensuring null values don't become strings
            ParameterId: [null, Validators.required], // Change to null instead of []
            parameterName: [""],
            Formula: [""],
            isActive: [true],
            createdBy: [1],
        });
    }
    
    public formulaUpdate(Param: any) {
        debugger
        if (Param.parameterId) {
            return this._httpClient.PutData("ParameterMaster/EditFormula/" + Param.parameterId, Param);
        } 
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

    public deactivateTheStatus(param) {
        return this._httpClient.PostData("ParameterMaster/ParameterCancel", param);
    }
        
    // public deactivateTheStatus(parameterId: number) {
    //     return this._httpClient.DeleteData(`ParameterMaster/ParameterCancel?parameterId=${parameterId}`);
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

    public getTableData(param,isNumericParameter){
        debugger
        this.is_numeric = isNumericParameter === 1;

        if(this.is_numeric) {
            return this._httpClient.PostData(
                "MPathParaRangeWithAgeMaster/MPathParaRangeWithAgeMasterList",param
                // { parameterId: param }
            ); 
        }
        else{
        return this._httpClient.PostData(
            "ParameterDescriptiveMaster/MParameterDescriptiveMasterList",param
            // { parameterId: param }
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
        debugger
        console.log("sfjhgfskjsfg",param)
        this.myform.patchValue(param);
        this.myform.get("isPrintDisSummary").setValue(param.IsPrintDisSummary == "false" ? false : true);
        this.myform.get("isNumeric").setValue(param.IsNumeric == 1? 1: 2);
        this.is_numeric = param.IsNumeric == 1? true : false;
        this.numericList = param.numericList;
        this.descriptiveList = param.descriptiveList;
    }
}
