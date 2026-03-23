import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class MrdDetailsService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.myformSearch = this.createSearchForm();
    }

    // createSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         ConsentNameSearch: [""],
    //         IsDeletedSearch: ["2"],
    //     });
    // }


    filterForm(): FormGroup {
        return this._formBuilder.group({

            IsInout: 0,
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()]

        });
    }



    filterdischargeForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            IPDNo: '',
            FirstName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MiddleName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            LastName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MobileNo: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10),]],
            searchDoctorId: '0',
            DoctorName: '',
            IsDischarge: [0],
            WardId: '0',
            RoomName: '',
            fromDate: [new Date()],
            enddate: [new Date()],
            DischargeId: [''],
        });
    }


    public MrdInsert(Param) {
        debugger
        if (!Param.rmdrecordId)

            return this._httpClient.PostData("MRDFile/Insert", Param);
        else
            return this._httpClient.PutData("MRDFile/Edit/" + Param.rmdrecordId, Param)
    }



    public MrdINFileUpdate(Param) {

        return this._httpClient.PostData("MRDFile/InsertInFile", Param);

    }


    public MrdOutFileUpdate(Param) {

        return this._httpClient.PostData("MRDFile/InsertOutFile", Param);

    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }
    public getAdmissionById(Id) {
        return this._httpClient.GetData("Admission/" + Id);
    }

    public getDischargeId(Id) {
        return this._httpClient.GetData("DischargeSummary/" + Id);
    }
}