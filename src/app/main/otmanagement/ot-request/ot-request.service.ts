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
            opIpId:["",[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
            departmentId:[0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeryId:[0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            categoryId:[0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            siteDescId:["",[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId:[0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            otbookingDate:  [new Date()],
            otbookingTime: [new Date()],
            opIpType:  ["OP"],
            surgeryTypeId:[1,[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
         
           surgeryCategoryId:[0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            otrequestDate: [new Date(),[Validators.required,this._FormvalidationserviceService.validDateValidator()]],
            otrequestId: [0],
            otrequestTime: [new Date(),[Validators.required]],
             isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
       isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],

           
            
        });
    }
    // createSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         CityNameSearch: [""],
    //         IsDeletedSearch: [""],
    //     });
    // }

    getOtRequestList(fromDate: string, toDate: string) {
  return this._httpClient.PostData('OTBooking/OTBookingRequestEmergencyList', {
    fromDate,
    toDate
  });
}

    initializeFormGroup() {
        this.createRequestForm();
    }
populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }
   public getSurgeonsByDoctorType(doctTypeId) {
        return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId="+doctTypeId)
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
