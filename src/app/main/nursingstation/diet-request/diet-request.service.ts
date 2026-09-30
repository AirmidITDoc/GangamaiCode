import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
@Injectable({
    providedIn: 'root'
})
export class DietRequestService {


    MyForm: FormGroup;
    PainAssessForm: FormGroup;
    VitalsForm: FormGroup;
    SugarForm: FormGroup;
    OxygenForm: FormGroup;
    ApacheScoreForm: FormGroup;
    InPutOutputForm: FormGroup;

    constructor(
        public _formbuilder: UntypedFormBuilder,
        public _httpClient: HttpClient,
        public _httpClient1: ApiCaller,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        this.MyForm = this.createMyForm()

    }

    createMyForm() {
        return this._formbuilder.group({
            WardName: [''],
            RegID: [''],
            PatientName: ['']

        })
    }


    public getWardList() {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_WardMasterListForCombo", {});
    }
    public getpainAssesmentWeightList(param) {
        return this._httpClient1.PostData("ClinicalCare/NursingWeightList", param);
    }
    public getpainAssesmentList(Param) {
        return this._httpClient1.PostData("ClinicalCare/NursingPainAssessmentList", Param)
    }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
    }

    public SavePainAssesment(Param: any) {
        if (Param.painAssessmentId) {
            return this._httpClient1.PutData("ClinicalCare/NursingPainAssessmentUpdate/" + Param.painAssessmentId, Param);
        } else return this._httpClient1.PostData("ClinicalCare/NursingPainAssessmentInsert", Param);
    }

    public SavePainAssesmentWeight(Param: any) {
        if (Param.patWeightId) {
            return this._httpClient1.PutData("ClinicalCare/NursingWeightUpdate/" + Param.patWeightId, Param);
        } else return this._httpClient1.PostData("ClinicalCare/NursingWeightInsert", Param);
    }

    public getRtrvVitallist(param) {
        return this._httpClient1.PostData("ClinicalCare/NursingVitalsList", param)
    }

    public getRtrvSugarlevellist(param) {
        return this._httpClient1.PostData("ClinicalCare/NursingSugarlevelList", param)
    }

    public getRtrvOxygenlist(param) {
        return this._httpClient1.PostData("ClinicalCare/NursingOxygenVentilatorList", param)
    }

    public SaveVitalInfo(Param: any) {
        if (Param.vitalId) {
            return this._httpClient1.PutData("ClinicalCare/NursingVitalUpdate/" + Param.vitalId, Param);
        } else return this._httpClient1.PostData("ClinicalCare/NursingVitalInsert", Param);
    }

    public SaveSugarlevel(Param: any) {
        if (Param.id) {
            return this._httpClient1.PutData("ClinicalCare/NursingSugarLevelUpdate/" + Param.id, Param);
        } else return this._httpClient1.PostData("ClinicalCare/TNursingSugarLevelInsert", Param);
    }

    public SaveOxygenVentilator(Param: any) {
        if (Param.id) {
            return this._httpClient1.PutData("ClinicalCare/NursingOrygenVentilatorUpdate/" + Param.id, Param);
        } else return this._httpClient1.PostData("ClinicalCare/NursingOrygenVentilatorInsert", Param);
    }

    public OnDeleteAssessment(param) {
        return this._httpClient1.PostData('ClinicalCare/TNursingPainAssessmentCancel', param)
    }

    public OnDeleteAssessmentWeight(param) {
        return this._httpClient1.PostData('ClinicalCare/TNursingWeightCancel', param)
    }

    public OnDeleteVital(param) {
        return this._httpClient1.PostData('ClinicalCare/TNursingVitalCancel', param)
    }

    public OnDeleteSugar(param) {
        return this._httpClient1.PostData('ClinicalCare/TNursingSugarLevelCancel', param)
    }

    public OnDeleteOxygenVen(param) {
        return this._httpClient1.PostData('ClinicalCare/TNursingOrygenVentilatorCancel', param)
    }
    public getLabResultView(Param) {
        return this._httpClient1.PostData("Common", Param)
    }
    public getSampleRecivedlist(employee) {
        return this._httpClient1.PostData("ClinicalCare/AdmisionListNursingList", employee)
    }
    public SaveDietReq(Param: any) {
        if (Param.dietReqId) {
            return this._httpClient1.PutData("DietPatientRequest/Edit/" + Param.dietReqId, Param);
        } else return this._httpClient1.PostData("DietPatientRequest/Insert", Param);
    }


    public Requestcancle(employee, loader = true) {

        return this._httpClient1.PostData("DietPatientRequest/DietPatientReqHeaderCancel", employee);
    }

    public DetailRequestcancle(employee, loader = true) {

        return this._httpClient1.PostData("DietPatientRequest/DietPatReqDetailCanel", employee);
    }


    public getdetaillist(employee) {
        return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestDetailsList", employee)
    }
    public getRequestlist(employee) {
        return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestHeaderList", employee)
    }
     public getRequestdetaillist(employee) {
        return this._httpClient1.PostData("DietPatientRequest/DietPatientRequestDetailsList", employee)
    }
}
