import { UntypedFormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InstructionmasterService } from '../instructionmaster.service';

@Component({
  selector: 'app-new-instruction-master',
  templateUrl: './new-instruction-master.component.html',
  styleUrls: ['./new-instruction-master.component.scss']
})
export class NewInstructionMasterComponent implements OnInit {
  instructionForm:UntypedFormGroup;
  isActive:boolean=true;

  constructor(
    public _InstructionMasterService: InstructionmasterService,
    public dialogRef: MatDialogRef<NewInstructionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.instructionForm=this._InstructionMasterService.createInstructionForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.instructionForm.patchValue(this.data);
    }
  }

    saveflag : boolean = false;
    onSubmit() {
        debugger
      if(!this.instructionForm.invalid){
        this.saveflag = true;
        
        // var mdata=
        // {
        //   "InstructionId": 0,
        //   "instructionDescription": this.instructionForm.get("InstructionName").value || "",
        //   "instructioninMarathi": "ABC"
        // }
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
