import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RefundbillService } from 'app/main/opd/refundbill/refundbill.service';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service'; 

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatientSearchComponent implements OnInit {
  SearchGroupForm :FormGroup;
  registerObj:any; 


constructor(
 public _formbuilder:FormBuilder,
 public _RefundbillService:RefundbillService,
 public _matdailog:MatDialog,
    public dialogRef: MatDialogRef<PatientSearchComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
 public _formvalidationservice:FormvalidationserviceService 
){}
ngOnInit(): void {
 this.SearchGroupForm = this.createSearchform();
 this.SearchGroupForm.markAllAsTouched
}

createSearchform(){
  return this._formbuilder.group({
    regId:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
    mobileNo:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
    emailId:[''[this._formvalidationservice.notEmptyOrZeroValidator()]],
    aadharCardNo:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
  })
}
  getSelectedObj(obj) {
     console.log(obj); 
     this.registerObj = obj;
      this.SearchGroupForm.patchValue({ 
    mobileNo:obj?.mobileNo || '',
    emailId: '',
    aadharCardNo: '',
      })
//      {
//     "text": "Sandeep Yarakal | 200 | 9632515974",
//     "value": 110169,
//     "regNo": "200",
//     "mobileNo": "9632515974",
//     "ageYear": "29   ",
//     "ageMonth": "0    ",
//     "ageDay": "0    ",
//     "patientName": "Sandeep Gorakhnath Yarakal"
// }
  }

createSaveForm(){
  return this._formbuilder.group({
    RegId:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
    MobileNo:[0,[this._formvalidationservice.notEmptyOrZeroValidator(),this._formvalidationservice.onlyNumberValidator(),
      Validators.max[10],Validators.min[10]
    ]],
    mailId:['',[this._formvalidationservice.notEmptyOrZeroValidator(),Validators.email,
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    NationalId:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
  })
}
OnSave(){ 
 if(this.SearchGroupForm.valid){
    const fromvalues = this.SearchGroupForm.value
  this._RefundbillService.globlePatientdetUpdates(this.SearchGroupForm.value,fromvalues?.RegId).subscribe(response=>{
      this.OnClose();
  })
 }
}
  OnClose(){
    this.SearchGroupForm.reset();
    this.dialogRef.close();
  }
}
