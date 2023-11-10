import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor( private _toastr:ToastrService) { }

  showSuccess(message){  
    this._toastr.success('Operation completed successfully!');
  }  
}
