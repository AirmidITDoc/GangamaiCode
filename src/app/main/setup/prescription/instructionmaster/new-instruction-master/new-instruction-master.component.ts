import { FormGroup } from '@angular/forms';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InstructionmasterService } from '../instructionmaster.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-instruction-master',
    templateUrl: './new-instruction-master.component.html',
    styleUrls: ['./new-instruction-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewInstructionMasterComponent implements OnInit {
  instructionForm:FormGroup;
  isActive:boolean=true;

  constructor(
    public _InstructionMasterService: InstructionmasterService,
    public dialogRef: MatDialogRef<NewInstructionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

    ngOnInit(): void {
        this.instructionForm=this._InstructionMasterService.createInstructionForm();
        this.instructionForm.markAllAsTouched();
        if((this.data?.instructionId??0) > 0)
            {
            this.isActive=this.data.isActive
            this.instructionForm.patchValue(this.data);
        }
    }

    
    onSubmit() {
        
      if(!this.instructionForm.invalid)
      {
      
        console.log("Instruction json:", this.instructionForm.value);
  
        this._InstructionMasterService.instructionMasterInsert(this.instructionForm.value).subscribe((response)=>{
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
        this.instructionForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages(){
        return{
            instructionDescription: [
                { name: "required", Message: "Instruction Name is required" },
                { name: "maxlength", Message: "Instruction name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

}
