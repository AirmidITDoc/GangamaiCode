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
     isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.tariffForm.patchValue(m_data);
    console.log("mdata:", m_data)
  }

  onSubmit(){
    if(this.tariffForm.valid){
      debugger
      this._TariffMasterService.tariffMasterSave(this.tariffForm.value).subscribe((response)=>{
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error)=>{
        this.toastr.error(error.message);
      });
    }
  }

  onClear(val: boolean) {
    this.tariffForm.reset();
    this.dialogRef.close(val);
}

}
