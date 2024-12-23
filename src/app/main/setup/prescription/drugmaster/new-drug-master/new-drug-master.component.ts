import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DrugmasterService } from '../drugmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-drug-master',
  templateUrl: './new-drug-master.component.html',
  styleUrls: ['./new-drug-master.component.scss']
})
export class NewDrugMasterComponent implements OnInit {

  drugForm:FormGroup;
  isActive:boolean=true;

  autocompleteModeClass: string = "Class";  
  autocompleteModeGenericName: string = "GenericName";

  constructor(
      public _durgMasterService: DrugmasterService,
      public dialogRef: MatDialogRef<NewDrugMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.drugForm=this._durgMasterService.createDrugForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.drugForm.patchValue(this.data);
    }
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true
   
      if(!this.drugForm.get("DrugId").value){
        debugger
        var mdata=
        {
          "drugId": 0,
          "drugName": this.drugForm.get("DrugName").value || "",
          "genericId": parseInt(this.drugForm.get("GenericId").value) || 0,
          "classId": parseInt(this.drugForm.get("ClassId").value) || 0,
          "isActive": true
        }
        console.log("drug json:", mdata);
  
        this._durgMasterService.drugMasterInsert(mdata).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } else{
        //update
      }
    
}

onClear(val: boolean) {
  this.drugForm.reset();
  this.dialogRef.close(val);
}

ClassId=0;
GenericId=0;

selectChangeClass(obj: any){
  console.log(obj);
  this.ClassId=obj.value
}
selectChangeGeneric(obj: any){
  console.log(obj);
  this.ClassId=obj.value
}

getValidationGeneric(){
  return {
    GenericId: [
          { name: "required", Message: "Generic Name is required" }
      ]
  };
}
getValidationClass(){
  return {
    ClassId: [
          { name: "required", Message: "Class Name is required" }
      ]
  };
}

}
