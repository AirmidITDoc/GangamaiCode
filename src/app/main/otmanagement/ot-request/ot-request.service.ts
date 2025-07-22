import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class OtRequestService {

 requestform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.requestform = this.createRequestForm();
       // this.myformSearch = this.createSearchForm();
    }

    createRequestForm(): FormGroup {
        return this._formBuilder.group({
            otbookingId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opIpId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            departmentId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            categoryId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            siteDescId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeonId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otbookingDate:  [""],
            otbookingTime: [""],
            opIpType: 'OP',
            surgeryType:["Normal"],
          //  isCancelledDateTime:  [""],
           
            otrequestDate: [""],
            otrequestId: [""],
            otrequestTime: [""],
             isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
       isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],

           
            // cityName: ["",
            //     [
            //         Validators.required,
            //         Validators.pattern('^[a-zA-Z0-9 ]*$'),
            //         this._FormvalidationserviceService.allowEmptyStringValidator()
            //     ] 
            // ],
            // stateId: [0, 
            //     [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            // ],
            // isActive:[true,[Validators.required]]
        });
    }
    // createSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         CityNameSearch: [""],
    //         IsDeletedSearch: [""],
    //     });
    // }

    initializeFormGroup() {
        this.createRequestForm();
    }

   

    public requestSave(Param: any) {
        if (Param.otbookingId) {
            return this._httpClient.PutData("OTBooking/Edit/" + Param.otbookingId, Param);
        } else return this._httpClient.PostData("OTBooking/InsertEDMX", Param);
    }

    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.DeleteData("CityMaster?Id=" + m_data.toString());
    // }
}
