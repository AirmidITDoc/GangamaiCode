import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class DailyExpensesService {

  DailyExpensesForm:FormGroup
  NewExpensesForm:FormGroup

  constructor(
    public _formbuild:FormBuilder,
    public _httpClient:HttpClient,
    public loaderService:LoaderService
  ) 
  {
    this.DailyExpensesForm = this.CreateDailyExpenseForm();
    this.NewExpensesForm = this.CreateNewExpenseForm();
   }

   CreateDailyExpenseForm(){
    return this._formbuild.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      expType:'2'
    });
   }
   CreateNewExpenseForm(){
    return this._formbuild.group({ 
      expenseshead:'',
      ExpType:'0',
      VoucharNo:'',
      ExpAmount:'',
      Reason:'',
      PersonName:''
    });
   }


   public getDailyExpensesList(data,loader = true){
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_T_Expenses",data);
   }
   public getExpHeadCombobox(loader = true){
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_M_ExpHeadMasterForCombo",{});
   }
   public SaveDailyExpenses(data,loader = true){
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("Administration/SaveTExpenseParam",data);
   }
   public CancelDailyExpenses(data,loader = true){
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("Administration/CancleTExpenseParam",data);
   }
   public SaveExpensesHead(data,loader = true){
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("Administration/SaveMExpensesHeadMaster",data);
   }
}
