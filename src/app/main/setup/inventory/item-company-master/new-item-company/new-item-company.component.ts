import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ItemCompanyMasteService } from '../item-company-maste.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-new-item-company',
  templateUrl: './new-item-company.component.html',
  styleUrls: ['./new-item-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewItemCompanyComponent implements OnInit {

  registerObj:any;
  vItemCompanyName:any;
  vIsDeleted:any;
  vCompanyId:any;

  constructor(
    public _ItemCompanyMasteService : ItemCompanyMasteService,
    public toastr : ToastrService, 
    public _matDialog: MatDialog, 
    public dialogRef: MatDialogRef<NewItemCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj ;
      console.log(this.registerObj);
      this.vCompanyId = this.registerObj.CompanyId; 
      this.vItemCompanyName = this.registerObj.CompanyName; 
      this.vIsDeleted =this.registerObj.IsDeleted; 
      if(this.registerObj.IsDeleted == true){
        this._ItemCompanyMasteService.myform.get("IsDeleted").setValue(0);
      }else{
        this._ItemCompanyMasteService.myform.get("IsDeleted").setValue(1);
      }
    }
  }


  onClear() {
    this._ItemCompanyMasteService.myform.reset({ IsDeleted: "false" });
    // this._ItemCompanyMasteService.initializeFormGroup();
    this._matDialog.closeAll();
}

onSubmit() {
    if (this._ItemCompanyMasteService.myform.valid) {
        if (
            !this._ItemCompanyMasteService.myform.get("ItemGenericNameId").value
        ) {
            var m_data = {
                insertItemGenericMaster: {
                    itemGenericName: this._ItemCompanyMasteService.myform
                        .get("ItemGenericName")
                        .value.trim(),
                    isDeleted: Boolean(
                        JSON.parse(
                            this._ItemCompanyMasteService.myform.get("IsDeleted")
                                .value
                        )
                    ),
                    addedBy: 1,
                    updatedBy: 1,
                },
            };

            this._ItemCompanyMasteService
                .insertItemCompanyMaster(m_data)
                .subscribe((data) => { 
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                          }); 
                        
                    } else {
                        this.toastr.error('Item-Generic Master Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                          });
                    } 
                },error => {
                    this.toastr.error('Item-Generic not saved !, Please check API error..', 'Error !', {
                     toastClass: 'tostr-tost custom-toast-error',
                   });
                 });
        } else {
            var m_dataUpdate = {
                updateItemGenericMaster: {
                    itemGenericNameId:
                        this._ItemCompanyMasteService.myform.get(
                            "ItemGenericNameId"
                        ).value,
                    itemGenericName: this._ItemCompanyMasteService.myform
                        .get("ItemGenericName")
                        .value.trim(),
                    isDeleted: Boolean(
                        JSON.parse(
                            this._ItemCompanyMasteService.myform.get("IsDeleted")
                                .value
                        )
                    ),
                    updatedBy: 1,
                },
            };

            this._ItemCompanyMasteService
                .updateItemCompanyMaster(m_dataUpdate)
                .subscribe((data) => { 
                    if (data) {
                        this.toastr.success('Record updated Successfully.', 'updated !', {
                            toastClass: 'tostr-tost custom-toast-success',
                          }); 
                        
                    } else {
                        this.toastr.error('Item-Generic Master Master Data not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                          });
                    } 
                },error => {
                    this.toastr.error('Item-Generic not updated !, Please check API error..', 'Error !', {
                     toastClass: 'tostr-tost custom-toast-error',
                   });
                 });
        }
        this.onClear();
    }
}
}
