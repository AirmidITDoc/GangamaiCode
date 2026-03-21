import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LabAppointmentService {

    myFilterform: FormGroup;
    MyForm: FormGroup;

    constructor(
        public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller,
        private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }

    public getPatientType(type) {
        return this._httpClient.GetData("LabPatientRegistration/GetMConstant?ConstantType=" + type);
    }
    public getLabRegistraionById(Id) {
        return this._httpClient.GetData("LabPatientRegistration/" + Id);
    }
    public getCompanyById(Id) {
        return this._httpClient.GetData("CompanyMaster/" + Id);
    }
    public getLabRegistraionMasterById(Id) {
        return this._httpClient.GetData("LabPatientRegistration/GetLabPatientRegisteredMaster?id=" + Id);
    }
    public getlabSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
        // debugger
        return this._httpClient.GetData(apiUrl + inputValue);
    }
    public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }
    public getcityId(Id) {
        return this._httpClient.GetData("CityMaster/" + Id);
    }
    public getMaster(mode, Id) {
        return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }
    public appointmentMasterSave(Param: any) {
        return this._httpClient.PostData("LabAppointment/Insert", Param);
    }
    public getAppoinments(Id: number, fromDate: string, toDate: string, categoryId: number) {
        // return this._httpClient.PostData("LabAppointment/LabAppointmentList", param);
        return this._httpClient.GetData("LabAppointment/get-Labappoinments?DocId=" + Id + "&FromDate=" + fromDate + "&ToDate=" + toDate + "&CategoryId=" + categoryId);
    }
    public getDateTimeChange(m_data) {
        return this._httpClient.PutData("LabAppointment/RescheduleLabAppointment", m_data);
    }
    public appointmentCancle(Param: any) {
        return this._httpClient.DeleteData("LabAppointment?Id=" + Param.toString());
    }
}
