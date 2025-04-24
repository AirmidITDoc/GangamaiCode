import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AdministrationService } from '../administration.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'app/main/shared/services/toaster.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gstrecalculation',
  templateUrl: './gstrecalculation.component.html',
  styleUrls: ['./gstrecalculation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GSTRecalculationComponent implements OnInit {

  gstForm:FormGroup

  constructor(
    public _formbuilder:FormBuilder,
    public _matdialog:MatDialog,
    public _AdministrationService:AdministrationService,
    public datepipe:DatePipe,
    public toastr:ToastrService
  ) { }

  ngOnInit(): void {
  this.CreateGstForm();
  }

  CreateGstForm(){
    this.gstForm = this._formbuilder.group({ 
      FromDate:[new Date()],
      ToDate:[new Date()]
    })
  } 

  OnSave(){ 
    var vdata ={
      'insertGSTReCalculProcessParam':{
        'fromDate':this.datepipe.transform(this.gstForm.get('FromDate').value,'MM/dd/yyyy') || '01/01/1999',
        'toDate':this.datepipe.transform(this.gstForm.get('ToDate').value, 'MM/dd/yyyy') || '01/01/1999', 
       }
    }
 
 console.log(vdata)
 this._AdministrationService.getGSTRecalculate(vdata).subscribe(response=>{
  console.log(response)
  debugger
  if (response) {
    this.toastr.success('GST Re-Calculate Successfuly', 'Updated !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  } else {
    this.toastr.error('API Error!', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  }
 })
  }
  onClose(){
    this._matdialog.closeAll();
  }
}
