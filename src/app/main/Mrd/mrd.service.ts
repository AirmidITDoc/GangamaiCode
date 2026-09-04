import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class MrdService {

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder) {

    }


    filterForm(): FormGroup {
        return this._formBuilder.group({

            FirstName: '',
            LastName: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            labelType: '2',
            RegNo: 0
        });
    }



    public MrdcasepaperInsert(employee) {
        return this._httpClient.PostData("InPatient/MrdMedicalcasepaperInsert", employee)
    }

    public MrdcasepaperUpdate(employee) {
        return this._httpClient.PostData("InPatient/MrdMedicalcasepaperUpdate", employee)
    }

    public DeathcertificateInsert(employee) {
        return this._httpClient.PostData("InPatient/MrdDeathcertificateInsert", employee)
    }

    public getDoctorsByDepartment(deptId) {
        return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
    }

    public updateDeathCertificate(data) {
        return this._httpClient.PostData("DeathCertificate/Update", data)
    }

    public getDeathDetailsById(Id) {
        return this._httpClient.GetData("DeathCertificate/GetById/" + Id);
    }

     public getMedicalDetailsById(Id) {
        return this._httpClient.GetData("MedicolegalCertificate/" + Id);
    }

    public getAdmissionById(Id) {
        return this._httpClient.GetData("Admission/" + Id);
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }

    public medicoCertificateSave(Param: any) {
        debugger
        if (Param.docId) {
            return this._httpClient.PutData("MedicolegalCertificate/" + Param.docId, Param);
        } else return this._httpClient.PostData('MedicolegalCertificate', Param);
    }

    public deathCertificateSave(Param: any) {
        debugger
        if (Param.certificateId) {
            return this._httpClient.PutData("DeathCertificate/Update/" + Param.certificateId, Param);
        } else return this._httpClient.PostData('DeathCertificate/Insert', Param);
    }

    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReportFromDB", Param);
    }

}
