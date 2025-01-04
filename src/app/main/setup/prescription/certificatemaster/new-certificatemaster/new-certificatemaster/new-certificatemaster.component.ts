import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CertificatemasterService } from '../../certificatemaster.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-certificatemaster',
  templateUrl: './new-certificatemaster.component.html',
  styleUrls: ['./new-certificatemaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewCertificatemasterComponent implements OnInit {

  vTemplateName: any;
  vTemplateDesc: any;
  registerObj: any;
  vTemplateId: any;
  vIsDeleted:any;

  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '35rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,
  };

  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

  constructor(
    public _certificatetemplateService: CertificatemasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewCertificatemasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.data.obj) {
      this.registerObj = this.data.obj;
      this.vTemplateId = this.registerObj.CertificateId;
      this.vTemplateName = this.registerObj.CertificateName;
      this.vTemplateDesc = this.registerObj.CertificateDesc;
      if(this.registerObj.IsActive==true){
        this._certificatetemplateService.myform.get("IsDeleted").setValue('true')
        this.vIsDeleted=true;
      }else{
        this._certificatetemplateService.myform.get("IsDeleted").setValue('false')
        this.vIsDeleted=false;
      }
      console.log("RegObj:", this.registerObj)
    }
  }

  onSubmit() {
    debugger
    if (!this.vTemplateId) {
      var m_dataInsert = {
        "saveCertificateMasterParam": {
          "certificateId": 0,
          "certificateName": this._certificatetemplateService.myform.get("TemplateName").value || '',
          "certificateDesc": this._certificatetemplateService.myform.get("TemplateDesc").value || '',
          "isActive": Boolean(JSON.parse(this._certificatetemplateService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._certificatetemplateService.CertificateInsert(m_dataInsert).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    } else {
      debugger
      var m_dataUpdate = {
        "updateCertificateMasterParam": {
          "certificateId": this.vTemplateId,
          "certificateName": this._certificatetemplateService.myform.get("TemplateName").value || '',
          "certificateDesc": this._certificatetemplateService.myform.get("TemplateDesc").value || '',
          "isActive": Boolean(JSON.parse(this._certificatetemplateService.myform.get("IsDeleted").value) || 0),
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._certificatetemplateService.CertificateUpdate(m_dataUpdate).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  onClear() {
    this._certificatetemplateService.myform.reset();
  }

  onClose() {
    this._certificatetemplateService.myform.reset();
    this.dialogRef.close();
  }

}

export class CertificateList {
  CertificateId: number;
  CertificateName: string;
  CertificateDesc: string;
  IsDeleted: String;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CertificateList) {
    {
      this.CertificateId = CertificateList.CertificateId || '';
      this.CertificateName = CertificateList.CertificateName || '';
      this.CertificateDesc = CertificateList.CertificateDesc || '';
      this.IsDeleted = CertificateList.IsDeleted;
    }
  }
}
