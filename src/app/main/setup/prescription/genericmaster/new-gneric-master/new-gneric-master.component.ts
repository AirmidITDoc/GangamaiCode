import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericmasterService } from '../genericmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-gneric-master',
  templateUrl: './new-gneric-master.component.html',
  styleUrls: ['./new-gneric-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewGnericMasterComponent implements OnInit {

  genericForm:FormGroup;
  isActive:boolean=true;

  constructor(
    public _GenericMasterService: GenericmasterService,
      public dialogRef: MatDialogRef<NewGnericMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.genericForm=this._GenericMasterService.createGenericForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.genericForm.patchValue(this.data);
    }
  }

  saveflag: boolean= false;
  onSubmit() {
    debugger
      if(!this.genericForm.invalid){
        
        this.saveflag=true
        // var mdata=
        // {
        //   "genericId": 0,
        //   "genericName": this.genericForm.get("GenericName").value || ""
        // }
        console.log("generic json:", this.genericForm.value);
  
        this._GenericMasterService.genericMasterInsert(this.genericForm.value).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } 
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      }
    }

    onClear(val: boolean) {
        this.genericForm.reset();
        this.dialogRef.close(val);
    }


    getValidationMessages(){
        return{
            GenericName: [
                { name: "required", Message: "Generic Name is required" },
                { name: "maxlength", Message: "Generic Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

}
