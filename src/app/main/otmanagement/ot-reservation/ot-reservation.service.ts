import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class OtReservationService {

 reservationForm: FormGroup;
     myformSearch: FormGroup;
     bookingRequestForm: FormGroup;
     
     constructor(
         private _httpClient: ApiCaller,
         private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
     ) {
         this.reservationForm = this.createReservationForm();
         this.bookingRequestForm=this.tOtbookingRequestsForm();
         this.myformSearch = this.createSearchForm();
     }
 
     createReservationForm(): FormGroup {
         return this._formBuilder.group({
             
            otreservationId: [0],
            reservationDate:[new Date(),[Validators.required]],
            reservationTime: [new Date(),[Validators.required]],
            opIpId: [""],
            opIpType:  ["OP"],

            opdate:  [new Date()],
            opstartTime: ['',Validators.required],
            opendTime: ['',Validators.required],

            duration: [0],
            ottableId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId1: [0],
            anestheticsDr: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anestheticsDr1: [0],
            
            surgeryId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anesthTypeId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            instruction: [""],
            ottypeId: [0],
            unBooking: [false],
             isCancelled: [false],
            isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
       isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
       departmentId:[0],
     tOtbookingRequests:this._formBuilder.array([])
         });
     }
     
      tOtbookingRequestsForm(): FormGroup {
         return this._formBuilder.group({
            otbookingId:0,
            otrequestId:0
             });
     }
     createSearchForm(): FormGroup {
         return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
         });
     }
 populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }
     initializeFormGroup() {
         this.createReservationForm();
     }
 
    

 
     public reservationSave(Param: any) {
         if (Param.otreservationId) {
             return this._httpClient.PutData("OTReservation/Edit/" + Param.otreservationId, Param);
         } else return this._httpClient.PostData("OTReservation/Insert", Param);
     }
 
}
