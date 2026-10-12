import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class VaccineEntryService {

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
  }

  createVaccineForm(): FormGroup {
    return this._formBuilder.group({
      vaccineId: [0],
      vaccineCode:[''],
      vaccineName: ['', [Validators.maxLength(100)]],
      genericId: [0],          // DD
      vaccineType: ['', [Validators.maxLength(50)]],
      diseaseIndication: ['', [Validators.maxLength(150)]],
      manufacturer: [0],                                // DD (confirm with sir)
      brandName: ['', [Validators.maxLength(100)]],
      route: [0],                // DD (item master)
      dose: ['', [Validators.maxLength(30)]],
      ageGroup: [0],                                    // new DD (confirm with sir)
      noOfDoses: [0, [Validators.pattern(/^\d+$/), Validators.maxLength(3)]],
      doseSchedule: [0, [Validators.maxLength(100)]],
      minimumAge: [0, [Validators.pattern(/^\d+$/),Validators.maxLength(20)]],
      maximumAge: [0, [Validators.pattern(/^\d+$/),Validators.maxLength(20)]],
      boosterRequired: [false],                              // slider
      storageTemperature: ['', [Validators.maxLength(30)]],
      vialType: ['', [Validators.maxLength(50)]],
      vialSize: ['', [Validators.maxLength(30)]],
      diluentRequired: [false],                              // slider
      diluentVolume: ['',[Validators.maxLength(30)]],
      shelfLife: ['', [Validators.maxLength(30)]],
      batchNo: ['', [Validators.maxLength(30)]],
      expiryDate: [new Date()],                                    // date
      vaccineStatus: [false],                                 // slider
      remarks: ['', [Validators.maxLength(250)]]
    });
  }

  public vaccineSave(Param: any) {
        if (Param.vaccineId) {
            return this._httpClient.PutData("VaccineInformation/Edit/" + Param.vaccineId, Param);
        } else return this._httpClient.PostData("VaccineInformation/Insert", Param);
    }
}
