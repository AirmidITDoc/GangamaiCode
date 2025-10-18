import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})

export class AnesthesiaRecordService {

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

  createAnesthRecordForm(): FormGroup {
        return this._formBuilder.group({
           
            AnethStartDt: [''],
            AnethStartTime: [''],
            AnethEndDt: [''],
            AnethEndTime: [],
            RecoveryStartDt: [''],
            RecoveryStartTime: [''],
            RecoveryEndDt: [''],
            RecoveryEndTime: [],
            anestypeId: [0],
            Diagnosis:[[]],
            notes:[],
        });
    }
}
