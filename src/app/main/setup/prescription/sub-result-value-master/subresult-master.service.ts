import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class SubresultMasterService {

   Subresultvalues: FormGroup;
     
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _FormvalidationserviceService: FormvalidationserviceService
      ) {
          this.Subresultvalues = this.createSubresultvaluesForm();
         
      }

      createSubresultvaluesForm(): FormGroup {
          return this._formBuilder.group({
              subQuestionValId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
               questionId:  [0, 
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
              subQuestionValName: ["",
                  [
                      Validators.required, Validators.maxLength(50),
                      this._FormvalidationserviceService.allowEmptyStringValidator()
                  ]
              ],
              sequenceNo:  [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              resultValues: ['', Validators.required],
              shortcutValues: [''],
              isActive: [true, [Validators.required]],
           
          });
      }
     
      initializeFormGroup() {
          this.createSubresultvaluesForm();
      }
  
      
      public subresultSave(Param: any) {
          if (Param.subQuestionValId) {
              return this._httpClient.PutData("SubQuestionValuesMaster/" + Param.subQuestionValId, Param);
          } else return this._httpClient.PostData("SubQuestionValuesMaster", Param);
      }
  
      public deactivateTheStatus(m_data) {
          return this._httpClient.DeleteData("SubQuestionValuesMaster?Id=" + m_data.toString());
      }
  }
  
