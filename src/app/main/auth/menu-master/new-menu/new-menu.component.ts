import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from '../menu-master.service';
import { fuseAnimations } from '@fuse/animations';

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
    isActive:boolean=true;

    constructor(
        public _MenuMasterService: MenuMasterService,
        public dialogRef: MatDialogRef<NewMenuComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    // autocompleteModeroomId: string = "Room"; 

    // roomId = 0;

    ngOnInit(): void {
        this.menuForm = this._MenuMasterService.createMenuForm();
        var m_data = {
            id: this.data?.id,
            upId: this.data?.upId,
            //   roomId: this.data?.roomId || this.roomId,
            isAvailible: JSON.stringify(this.data?.isAvailible),
            // isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.menuForm.patchValue(m_data);
    }

    onSubmit() {
        debugger
        this.saveflag = true;

        if (this.menuForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            })
            return;
        } else {
            if (!this.menuForm.get("id").value) {

                var m_data =
                {
                    "id": 0,
                    "upId": parseInt(this.menuForm.get("upId").value),
                    "linkName": this.menuForm.get("linkName").value || 0,
                    "icon": this.menuForm.get("icon").value || 0,
                    "linkAction": this.menuForm.get("linkAction").value || 0,
                    "sortOrder": this.menuForm.get("sortOrder").value || 0,
                    // "isActive": true,
                    "isDisplay": this.menuForm.get("IsBlock").value || 0,
                    "permissionCode": 1,
                    "tableNames": 1
                }

                console.log("MenuMaster Insert:", m_data)

                this._MenuMasterService.menuMasterSave(m_data).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            } else {
                // update
                var m_data1 =
                {
                    "id": this.menuForm.get("id").value,
                    "upId": parseInt(this.menuForm.get("upId").value),
                    "linkName": this.menuForm.get("linkName").value || 0,
                    "icon": this.menuForm.get("icon").value || 0,
                    "linkAction": this.menuForm.get("linkAction").value || 0,
                    "sortOrder": this.menuForm.get("sortOrder").value || 0,
                    // "isActive": true,
                    "isDisplay": this.menuForm.get("IsBlock").value || 0,
                    "permissionCode": 1,
                    "tableNames": 1
                }

                console.log("MenuMaster Update:", m_data1)

                this._MenuMasterService.menuMasterUpdate(m_data1).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
            //   if (this.bedForm.valid) {
            //       this._BedMasterService.bedMasterSave(this.bedForm.value).subscribe((response) => {
            //           this.toastr.success(response.message);
            //           this.onClear(true);
            //       }, (error) => {
            //           this.toastr.error(error.message);
            //       });
            //   }
        }
    }

    onClear(val: boolean) {
        this.menuForm.reset({isActive: true});
        this.dialogRef.close(val);
    }
    getValidationroomeMessages() {
        return {
            roomId: [
                { name: "required", Message: "Room Name is required" }
            ]
        };
    }

}
