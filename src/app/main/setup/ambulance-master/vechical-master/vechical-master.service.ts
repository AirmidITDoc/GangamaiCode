import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class VechicalMasterService {


  constructor(  private _httpClient: ApiCaller,
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
              vehicleName: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()],],
              vehicleNo: [0,[Validators.required,
                 Validators.minLength(18),
            Validators.maxLength(18),this._FormvalidationserviceService.notEmptyOrZeroValidator()],],
              vehicleModel:["",[Validators.required, Validators.maxLength(50),
                      Validators.pattern('^[a-zA-Z0-9 ]*$')
                    // ,^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$
                ]
              ],
              manuDate:[new Date().toISOString()],
              vechicaltype: ["", 
                  Validators.required,Validators.maxLength(100),
                  Validators.pattern('^[a-zA-Z0-9 ]*$') ,Validators.maxLength(50),
              ],
              note: [''],
              isActive:'1'
            
          });
      }
  
   
           public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubTpaCompany?Id=" + m_data.toString());
    }

    
     public AmbulanceInsert(Param: any) {
        if (Param.vehicleId) {
            return this._httpClient.PutData("Ambulance/" + Param.vehicleId, Param);
        } else return this._httpClient.PostData("Ambulance", Param);
    }
}
