import { Component, OnInit, Inject } from '@angular/core';
import { TariffMasterService } from '../tariff-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';

@Component({
  selector: 'app-new-tariff',
  templateUrl: './new-tariff.component.html',
  styleUrls: ['./new-tariff.component.scss']
})
export class NewTariffComponent implements OnInit {

  tariffForm: FormGroup;
  constructor(
    public _TariffMasterService: TariffMasterService,
    public dialogRef: MatDialogRef<NewTariffComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.tariffForm=this._TariffMasterService.createTariffForm();
    
    var m_data = {
      tariffId: this.data?.tariffId,
     tariffName: this.data?.tariffName.trim(),
     isActive: JSON.stringify(this.data?.isActive),
    };
    this.tariffForm.patchValue(m_data);
    console.log("mdata:", m_data)
  }

  onSubmit(){
    if (this.tariffForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass:'tostr-tost custom-toast-warning',
    })
    return;
    }else{
      if(!this.tariffForm.get("tariffId").value){
        debugger
        var mdata={
          "tariffId": 0,
          "tariffName": this.tariffForm.get("tariffName").value || "",
          "isActive": Boolean(JSON.parse(this.tariffForm.get("isActive").value))
        }
        console.log("insert tariff:", mdata)
        
        this._TariffMasterService.tariffMasterSave(mdata).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } else{
        //update
      }
    }    
  }

  onClear(val: boolean) {
    this.tariffForm.reset();
    this.dialogRef.close(val);
}

}
