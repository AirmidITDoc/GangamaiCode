import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SchdulerService {
  myformSearch: FormGroup;
  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) {
  }
  public getSchedulers(ScheduleName) {
    return this._httpClient.get("Schedule/get-schedulers?ScheduleName="+ScheduleName);
  }
  public saveScheduler(Param) {
    return this._httpClient.post("Schedule/save", Param);
  }
  public deleteScheduler(id) {
    return this._httpClient.delete("Schedule/remove-scheduler?Id="+id);
  }

 
}
