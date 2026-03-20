import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class DoctorShareService {
    UserFormGroup: FormGroup;
    DocFormGroup: FormGroup;
    DocPrecessForm: FormGroup;

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        this.UserFormGroup = this.createUserFormGroup(),
        this.DocFormGroup = this.createDocFormGroup(),
        this.DocPrecessForm = this.createProDocFormGroup()
    }

    createUserFormGroup() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            //   enddate: [(new Date()).toISOString()],
            RegId: '',
            DoctorID: '',
            GroupId: '',
            FirstName: '',
            LastName: '',
            PbillNo: '',
            OP_IP_Type: ['1'],
            fromDate: [new Date().toISOString()],
            enddate: [new Date().toISOString()],
            fieldValue: "",
        })
    }


    createDocFormGroup() {
        return this._formBuilder.group({
            Type: ['1'],
            DoctorID: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DoctorName: '',
            ServiceID: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            GroupWise: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            PatientType: '0',
            ServiceOrgrpType: '1',
            ClassId: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DocShareType: 'P',
            Amount: '',
            Percentage: ''
        })
    }


    createProDocFormGroup() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }
    // public getPatientVisitedListSearch(Param) {
    //   return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", Param)
    // }
    // public getAdmittedDoctorCombo() {
    //   return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
    // }
    // public getBillListForDocShrList(param) {
    //   return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_BillListForDocShr",param)
    // }

    public InsertDocShare(Param) {
        debugger
        if (Param.doctorShareId == 0)
            return this._httpClient.PostData("DoctorShareMaster/InsertEDMX", Param)
        else
            return this._httpClient.PutData("DoctorShareMaster/" + Param.doctorShareId, Param);
    }

    public UpdateDocShare(Param: any) {
        if (Param.doctorShareId) {
            return this._httpClient.PutData("DoctorShareMaster/" + Param.doctorShareId, Param);
        }
    }

    public SaveProcessdocShare(Param) {
        return this._httpClient.PostData("DoctorShareProcess/DoctorShareProcess", Param)
    }


    // public getPdfDocShareSummaryRpt(FromDate,ToDate,DoctorId){
    //   return this._httpClient.GetData("DoctorShareReports/viewDoctorWiseSummaryReport?FromDate=" + FromDate +"&ToDate=" + ToDate +"&DoctorId" +DoctorId);
    // }
    // public getPdfDocShareRpt(FromDate,ToDate,DoctorId){
    //   return this._httpClient.GetData("DoctorShareReports/view-DoctorShareReport?FromDate=" + FromDate +"&ToDate=" + ToDate +"&DoctorId" +DoctorId);
    // }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }
}
