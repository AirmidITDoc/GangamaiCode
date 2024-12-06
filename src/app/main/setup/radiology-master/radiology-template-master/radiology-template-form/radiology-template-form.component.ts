import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radiology-template-form',
  templateUrl: './radiology-template-form.component.html',
  styleUrls: ['./radiology-template-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateFormComponent implements OnInit {
  templateForm: FormGroup;
  vTemplateDesc:any;
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };

  constructor(
      public _TemplateServieService: RadiologyTemplateMasterService,
      public dialogRef: MatDialogRef<RadiologyTemplateFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.templateForm = this._TemplateServieService.createRadiologytemplateForm();
      var m_data = {
          templateId: this.data?.templateId,
          templateName: this.data?.templateName.trim(),
          templateDesc: this.data?.templateDesc.trim(),
        //  templateDescInHtml: this.data?.templateDescInHtml.trim(),
      };
      this.templateForm.patchValue(m_data);
  }
  onSubmit() {

    if(this.templateForm.invalid){
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
    }else{
        if (!this.templateForm.get("templateId").value) {
            debugger
            var mdata={
                  "templateId": 0,
                  "templateName": this.templateForm.get("templateName").value,
                  "templateDesc": this.templateForm.get("templateDesc").value        
            }
            console.log('json mdata:',mdata);

              this._TemplateServieService.templateMasterSave(mdata).subscribe((response) => {
                  this.toastr.success(response.message);
                  this.onClear();
              }, (error) => {
                  this.toastr.error(error.message);
              });
          }
    }
    this.onClose();
}
onClose(){
  this.templateForm.reset();
  this.dialogRef.close();
}
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  onClear() {
      this.templateForm.reset();
      this.dialogRef.close();
  }
}
