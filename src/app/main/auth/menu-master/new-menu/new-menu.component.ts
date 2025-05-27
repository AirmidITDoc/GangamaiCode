import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from '../menu-master.service';

@Component({
    selector: 'app-new-menu',
    templateUrl: './new-menu.component.html',
    styleUrls: ['./new-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewMenuComponent implements OnInit {

    menuForm: FormGroup;
    saveflag: boolean = false;
    isActive: boolean = true;
    isDisplay: boolean=true;
    autocompleteModeUPID:string="MenuMain";

    constructor(
        public _MenuMasterService: MenuMasterService,
        public dialogRef: MatDialogRef<NewMenuComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        
        this.menuForm = this._MenuMasterService.createMenuForm();
        console.log("EditData:", this.data)
        if ((this.data?.id ?? 0) > 0) {
            var m_data = {
                id: this.data?.id,
                Menuid: this.data?.id,
                upId: this.data?.upId,
                linkName: this.data?.linkName,
                icon: this.data?.icon,
                linkAction: this.data?.linkAction,
                sortOrder: this.data?.sortOrder,
                permissionCode: this.data?.permissionCode,
                tableNames: this.data?.tableNames,
            };
            this.isActive = this.data.isActive
            this.isDisplay=this.data.isDisplay
            this.menuForm.patchValue(m_data);
        }
    }

    onSubmit() {
        
        this.saveflag = true;

        if (!this.menuForm.invalid) {

            console.log("MenuMaster json:", this.menuForm.value);
      
            this._MenuMasterService.menuMasterSave(this.menuForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });
          }
          else {
            this.toastr.warning('please check from is invalid', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
    }

    onClear(val: boolean) {
        this.menuForm.reset({ isActive: true });
        this.dialogRef.close(val);
    }

}
