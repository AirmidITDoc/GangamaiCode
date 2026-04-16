import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesApprovalService {

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _loaderService: LoaderService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  CreateSearchGroup() {
    return this._formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      ExpensenId: [0],
      expType: ["3"],
      expCategoryId: [0],
      approvalStatus: ['0']
    })
  }
  public getExpenselist(employee) {
    return this._httpClient.PostData("TExpense/DailyExpenceList", employee)
  }
   public UpdateExpApproval(employee) {
        return this._httpClient.PutData("TExpense/NewTExpenseUpdate", employee);
    }
}
