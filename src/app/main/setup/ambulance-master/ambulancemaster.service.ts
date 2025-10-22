import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class AmbulancemasterService {

  constructor(  private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _FormvalidationserviceService: FormvalidationserviceService) { }


   createAmbulanceForm(): FormGroup {
          return this._formBuilder.group({
             
              ambulanceId: [0],
              name: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()],],
              vechicalno: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()],],
              VechicleModel:["",[Validators.required, Validators.maxLength(50),
                      Validators.pattern('^[a-zA-Z0-9 ]*$')]
              ],
              manuDate:[new Date().toISOString()],
              vechicaltype: ["", 
                  Validators.required,Validators.maxLength(100),
                  Validators.pattern('^[a-zA-Z0-9 ]*$')
              ],
              note: [''],
              
              //  stateId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()
              //     ],
              // ],
              //  countryId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()
              //     ],
              // ],
              isActive:'1'
            
          });
      }
  
      createSearchForm(): FormGroup {
          return this._formBuilder.group({
              NameSearch: [""],
              IsActive: ["1"],
          });
      }

           public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubTpaCompany?Id=" + m_data.toString());
    }

         public AmbulanceInsert(m_data) {
        // return this._httpClient.PostData("SubTpaCompany?Id=" + m_data.toString());
    }
}
