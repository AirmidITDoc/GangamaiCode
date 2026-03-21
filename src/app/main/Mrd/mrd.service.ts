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
            enddate: [(new Date()).toISOString()]

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

}
