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
  ) { }

  ngOnInit(): void {
    if (this.data.obj) {
      this.registerObj = this.data.obj;
      this.vTemplateId = this.registerObj.CertificateId;
      this.vTemplateName = this.registerObj.CertificateName;
      this.vTemplateDesc = this.registerObj.CertificateDesc;
      console.log("RegObj:", this.registerObj)
    }
  }

  onSubmit() {

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
  CertificateId:number;
  CertificateName:string;
  CertificateDesc:string;
  IsDeleted:String;
  
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
