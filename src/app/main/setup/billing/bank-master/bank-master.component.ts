import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { BankMasterService } from "./bank-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewBankComponent } from "./new-bank/new-bank.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FormGroup } from "@angular/forms";


@Component({
    selector: "app-bank-master",
    templateUrl: "./bank-master.component.html",
    styleUrls: ["./bank-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BankMasterComponent implements OnInit {
    
  bankForm: FormGroup;
  format="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 10);";
  format1="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 12);";
  maxLength1="10"
  minLength1="10"
   maxLength="12"
  minLength="12"

  constructor(
    public _BankMasterService: BankMasterService,
    public dialogRef: MatDialogRef<NewBankComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.bankForm=this._BankMasterService.createBankForm();
    
    var m_data = {
      bankId: this.data?.bankId,
     bankName: this.data?.bankName.trim(),
     isActive: JSON.stringify(this.data?.isActive),
    };
    this.bankForm.patchValue(m_data);
    console.log("mdata:", m_data)
  }

  onSubmit(){
    if (this.bankForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass:'tostr-tost custom-toast-warning',
    })
    return;
    }else{
      if(!this.bankForm.get("bankId").value){
        debugger
        var mdata=
        {
          "bankId": 0,
          "bankName": this.bankForm.get("bankName").value || ""
        }
        console.log("bank json:", mdata);

        this._BankMasterService.bankMasterSave(mdata).subscribe((response)=>{
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
    this.bankForm.reset();
    this.dialogRef.close(val);
}
}
 
