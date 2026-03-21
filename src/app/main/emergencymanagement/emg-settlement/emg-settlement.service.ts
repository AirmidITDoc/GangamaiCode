import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class EmgSettlementService {

    constructor(public _httpClient: ApiCaller,
        private _loaderService: LoaderService,
        private _formBuilder: UntypedFormBuilder) { }


    public getEmergencyById(Id) {
        return this._httpClient.GetData("Emergency/" + Id);
    }

    public InsertIPSettlementPayment(employee) {
        return this._httpClient.PostData("IPBill/PaymentSettelment", employee)
    }
}
