import { FormGroup } from '@angular/forms';
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
  instructionForm:FormGroup;
  constructor(
    public _InstructionMasterService: InstructionmasterService,
    public dialogRef: MatDialogRef<NewInstructionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.instructionForm=this._InstructionMasterService.createInstructionForm();

    var m_data={
      InstructionId:this.data?.InstructionId,
      InstructionName:this.data?.InstructionName,      
      isActive: JSON.stringify(this.data?.isActive)
    };
    this.instructionForm.patchValue(m_data);    
    console.log("mdata:", m_data)
  }
  onSubmit() {
    if(!this.instructionForm.get("InstructionId").value){
      debugger
      var mdata=
      {
        "InstructionId": 0,
        "instructionDescription": this.instructionForm.get("InstructionName").value || "",
        "instructioninMarathi": "ABC"
      }
      console.log("Instruction json:", mdata);

      this._InstructionMasterService.instructionMasterInsert(mdata).subscribe((response)=>{
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
  this.instructionForm.reset();
  this.dialogRef.close(val);
}

}
