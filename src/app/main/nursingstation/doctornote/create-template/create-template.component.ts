import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DoctornoteService } from '../doctornote.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateTemplateComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '25rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  screenFromString = 'Template';
  isLoading = true;
  sIsLoading: string = '';
  vTemplateName: any;
  vTemplateDesc: any;
  registerObj: any;
  vTemplateId: any;

  constructor(
    public _NursingStationService: DoctornoteService,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this._NursingStationService.Templateform.reset();
    this.dialogRef.close();
    this._NursingStationService.Templateform.get("Category").setValue('NursNote')
    this._NursingStationService.Templateform.get("IsDeleted").setValue(true)
  }
  onSubmit() {
    if (!this._NursingStationService.Templateform.get("TemplateId").value) {
      let saveMTemplateMasterParam={
       "templateId": 0,
       "category": this._NursingStationService.Templateform.get("Category").value,
       "templateName": this._NursingStationService.Templateform.get("TemplateName").value,
       "templateDesc": this._NursingStationService.Templateform.get("TemplateDesc").value,
       "isActive":this._NursingStationService.Templateform.get("IsDeleted").value,
       "createdBy":this.accountService.currentUserValue.user.id
      } 

      let submitData ={
        "saveMTemplateMasterParam":saveMTemplateMasterParam
      } 
      console.log(submitData);
      this._NursingStationService.insertTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this._matDialog.closeAll();
          this.onClose();
        } else {
          this.toastr.error('Template Master Master Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        } 
      }, error => {
        this.toastr.error('New Template Order Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });  
      });
    }
    else { 
      let updateMTemplateMasterParam={
        "templateId": this._NursingStationService.Templateform.get("TemplateId").value || 0,
        "category": this._NursingStationService.Templateform.get("Category").value,
        "templateName": this._NursingStationService.Templateform.get("TemplateName").value,
        "templateDesc": this._NursingStationService.Templateform.get("TemplateDesc").value,
        "isActive":this._NursingStationService.Templateform.get("IsDeleted").value,
        "modifiedBy":this.accountService.currentUserValue.user.id
       }  
      let submitData = {
      "updateMTemplateMasterParam": updateMTemplateMasterParam
      } 
      console.log(submitData);
      this._NursingStationService.updateTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); 
          this.onClose();
        } else {
          this.toastr.error('Template Master Master Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        // this.isLoading = '';
      }, error => {
        this.toastr.error('New Template Order Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }

}

