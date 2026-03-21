import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class DrivermasterService {

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService) { }



    createDriverForm(): FormGroup {
        return this._formBuilder.group({

            driverId: [0],
            driverName: ['', [Validators.required]],
            address: [0, [Validators.required]],
            cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            dateOfBirth: [new Date().toISOString()],

            JoinDate: [new Date().toISOString(), Validators.required],
            mobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            experience: [0, Validators.required],
            licenceNo: ['', [Validators.required,
            Validators.minLength(15),
            Validators.maxLength(15)
            ]],

            // isActive:'1'

        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            NameSearch: [""],
            IsActive: ["1"],
        });
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Driver?Id=" + m_data.toString());
    }



    public DriverInsert(Param: any) {
        if (Param.driverId) {
            return this._httpClient.PutData("Driver/" + Param.driverId, Param);
        } else return this._httpClient.PostData("Driver", Param);
    }
}
