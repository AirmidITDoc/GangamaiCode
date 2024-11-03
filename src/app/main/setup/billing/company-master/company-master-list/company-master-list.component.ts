import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMasterComponent } from "../company-master.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
  
    companyForm: FormGroup;
    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        var m_data = {
          itemCategoryId: this.data?.itemCategoryId,
          itemCategoryName: this.data?.itemCategoryName.trim(),
          itemTypeId: this.data?.itemTypeId,
        //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
        //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
        // isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.companyForm.patchValue(m_data);
    }
    onSubmit() {
        if (this.companyForm.valid) {
          debugger
            this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
  
    onClear(val: boolean) {
        this.companyForm.reset();
        this.dialogRef.close(val);
    }
  }
  