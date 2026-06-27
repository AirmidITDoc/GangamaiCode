import { HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Injectable({
    providedIn: 'root'
})
export class RadopPcpndService {

    constructor(private handler: HttpBackend, private _httpClient: ApiCaller, private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        // this.myform = this.createtemplateForm();
        // this.myformSearch = this.createSearchForm();
    }


    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: [],
            FirstName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            start: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            end: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            MobileNo: ['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            CityId: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            PatientTypeSearch: ['1'],
        });
    }
    public pcpndtSave(Param) {
        debugger
        if (Param.pcpndtprocessId) {
            return this._httpClient.PutData("Pcpndprocess/Edit/"+ Param.pcpndtprocessId, Param);
        } else return this._httpClient.PostData("Pcpndprocess/Insert", Param);
    }

 public getReportView(mode) {
         return this._httpClient.PostData("Report/ViewReport", mode);
    }

    public getIndicationList(employee) {
        return this._httpClient.PostData("Common", employee);
    }
}
