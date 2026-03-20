import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class AmbulanceListService {

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder) { }

    filterForm(): FormGroup {
        return this._formBuilder.group({

            FirstName: '',
            LastName: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()]

        });
    }


    ambulanceallocaterForm(): FormGroup {
        return this._formBuilder.group({
            BillNo: '',
            CaseId: '',
            PatientName: '',
            VehicleNo: 0,
            VechicleNo: '',
            VechicleModel: '',
            DriverName: '',
            driverContactno: '',
            PatientAddress: '',
            Date: [(new Date()).toISOString()],
            Amount: '',
            PaidAmt: '',
            BalAmt: '',
        });
    }

}
