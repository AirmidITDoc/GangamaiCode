import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NewSchdulerService {

  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) { }
}
