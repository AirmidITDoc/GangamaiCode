import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class PatientTemporaryMovementService {

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            RegNo: []
        });
    }

    createPatienttemMoveForm(): FormGroup {
        return this._formBuilder.group({
            opIpType: ["OP"],
            opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            TransferType: ["1"],
            moveDate: [],
            moveTime: [],
            toDepId: [],
            accompaniedId: [],
            authorisedId: [],
            purMovingId: [],
            modeTranId: [],
            movinfId: [],
            extra: [],
            extraRemark: [''],
            equipId: [],
            equipRemark: [''],
        });
    }
}
