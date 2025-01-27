import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class AppointmentlistService {
    myCrossConsulteForm: FormGroup;
    myformSearch: FormGroup;
    personalFormGroup: FormGroup;
    VisitFormGroup: FormGroup;

    constructor(public _httpClient1: ApiCaller, private _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
        public _httpClient: HttpClient,
    ) {
        this.myformSearch = this.filterForm();
        this.myCrossConsulteForm = this.createConsultatDrForm();
    }


    // new APi

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
            ]],
            DoctorId: '',
            DoctorName: '',
            IsMark: 2,
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            patientNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }


    createConsultatDrForm() {
        return this._formBuilder.group({
            visitId: 0,
            regId: 0,
            consultantDocId: '',
            departmentId: ''
        });
    }

    createRefranceDrForm() {
        return this._formBuilder.group({
            visitId: 0,
            // regId:0,
            refDocId: ['', [
                Validators.required]],

        });
    }

    initializeFormGroup() {
        // this.createPesonalForm();
        // this.createVisitdetailForm();
    }


    public documentuploadInsert(employee, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient1.PutData("InPatient/DocAttachment", employee);
    }

    public NewappointmentSave(Param: any, showLoader = true) {
        // if (Param.visitID) {
        return this._httpClient1.PostData("VisitDetail/AppVisitInsert", Param, showLoader);
        // } else return this._httpClient1.PostData("VisitDetail/AppVisitInsert", Param, showLoader);
    }

    public RregisteredappointmentSave(Param: any, showLoader = true) {

        return this._httpClient1.PostData("VisitDetail/Update", Param, showLoader);

        // else return this._httpClient1.PostData("VisitDetail/AppVisitInsert", Param, showLoader);
    }

    public EditConDoctor(Param: any, showLoader = true) {

        return this._httpClient1.PutData("ConsRefDoctor/Edit/" + Param.visitId, Param, showLoader);
    }

    public EditRefDoctor(Param: any, showLoader = true) {

        return this._httpClient1.PostData("ConsRefDoctor/RefDoctorUpdate", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("VisitDetail", m_data);
    }

    public crossconsultSave(Param: any, showLoader = true) {
        return this._httpClient1.PostData("CrossConsultation/CrossConsultationInsert", Param, showLoader);

    }





    // new API?

    public getAppointmentList(employee) {
        return this._httpClient1.PostData("VisitDetail/AppVisitList", employee)
    }

    public Appointmentcancle(employee, loader = true) {

        return this._httpClient1.PostData("VisitDetail/Cancel", employee);
    }

    public getdoctorList(employee) {
        return this._httpClient1.PostData("DoctoreMaster/List", employee)
    }

    public getVisitById(Id, showLoader = true) {
        return this._httpClient1.GetData("VisitDetail/" + Id, showLoader);
    }
    public getPatientListView(mode) {
        return this._httpClient1.PostData("Report/ViewReport", mode);

    }

    public getMaster(mode, Id) {
        return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }

    public getAppointmenttemplateReport(Param: any, showLoader = true) {
        return this._httpClient1.PostData("Report/ViewReport", Param, showLoader);
    }

    public getRegistraionById(Id, showLoader = true) {
        return this._httpClient1.GetData("OutPatient/" + Id, showLoader);
    }
    public getRegistrations(keyword, showLoader = true) {
        return this._httpClient1.GetData("OutPatient/auto-complete?Keyword=" + keyword, showLoader);
    }
}

//192.168.2.100:
// "url": "http://192.168.2.100:9090/api"