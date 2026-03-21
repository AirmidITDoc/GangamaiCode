import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class VechicalMasterService {


    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService) { }



    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            NameSearch: [""],
            IsActive: ["1"],
        });
    }

    createAmbulanceForm(): FormGroup {
        return this._formBuilder.group({

            vehicleId: [0],
            vehicleName: ['', [Validators.required]],
            vehicleNo: ['', [Validators.required,
            Validators.maxLength(18)]],
            vehicleModel: ["", [Validators.required, Validators.maxLength(50)]],
            manuDate: [new Date().toISOString()],
            vehicleType: ["",
                Validators.required, Validators.maxLength(50),
            ],
            note: [''],
            //   isActive:'1'

        });
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Ambulance?Id=" + m_data.toString());
    }


    public AmbulanceInsert(Param: any) {

        if (Param.vehicleId) {
            return this._httpClient.PutData("Ambulance/" + Param.vehicleId, Param);
        } else return this._httpClient.PostData("Ambulance", Param);
    }
}
