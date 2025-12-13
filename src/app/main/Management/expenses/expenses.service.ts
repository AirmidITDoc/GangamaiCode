import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _loaderService: LoaderService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  CreateSearchGroup() {
    return this._formBuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      ExpensenId: [0],
      expType: ["3"],
      expCategoryId:[0]
    })
  }

  CreateMyForm() {
    return this._formBuilder.group({
      expID: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      expDate: ['', [Validators.required]],
      expTime: ['', [Validators.required]],
      expHeadId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      expCategoryId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      expType: [0],
      voucharNo: "",
      expAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      personName: ['', [Validators.required]],
      narration: ['',[Validators.required]],
      utrno: ['',[Validators.maxLength(10)]],
      isCancelled: false,
      isCancelledBy: 0,
      cancelledDate: "1900-01-01"
    })
  }

  createHeadMasterForm(): FormGroup {
    return this._formBuilder.group({
      expHedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      headName: ["",
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9 ()]*$'),
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      isActive: [true, [Validators.required]]
    });
  }
    createCategoryMasterForm(): FormGroup {
    return this._formBuilder.group({
      expCatId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      CategoryName: ["",
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9 ()]*$'),
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      isActive: [true, [Validators.required]]
    });
  } 
  public ExpensesSave(Param: any) {
    if (Param.expID) {
      return this._httpClient.PutData("TExpense/TExpenseUpdate" + Param.expID, Param);
    } else return this._httpClient.PostData("TExpense/TExpenseInsert", Param);
  }
  
  public OnCancel(param) {
    return this._httpClient.PostData('TExpense/TExpenseCancel', param)
  }

  public headMasterSave(Param: any) {
    if (Param.expHedId) {
      return this._httpClient.PutData("ExpensesHeadMaster/" + Param.expHedId, Param);
    } else return this._httpClient.PostData("ExpensesHeadMaster", Param);
  }

   public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ExpensesHeadMaster?Id=" + m_data.toString());
    }


    public CategoryMasterSave(Param: any) {
    if (Param.expHedId) {
      return this._httpClient.PutData("ExpensesCategoryMaster/" + Param.expCatId, Param);
    } else return this._httpClient.PostData("ExpensesCategoryMaster", Param);
  }
     public deactivateCategoryTheStatus(m_data) {
        return this._httpClient.DeleteData("ExpensesCategoryMaster?Id=" + m_data.toString());
    }
}
