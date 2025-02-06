import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { DoctornoteService } from '../../doctornote.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateTemplateComponent {

  TemplateId: any;
  vTemplateName: any;
  vTemplateDesc: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '24rem',
    minHeight: '24rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,
  };

  onBlur(e: any) {
    // this.vTemplateDesc = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  constructor(
    public _NursingStationService: DoctornoteService,
    public dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {

  }
  onClose() {
    this._NursingStationService.Templateform.reset();
    this.dialogRef.close();
    this._NursingStationService.Templateform.get("Category").setValue('NursNote')
    this._NursingStationService.Templateform.get("IsDeleted").setValue(true)
  }

  onClear() {
    this._NursingStationService.Templateform.reset();
  }

}
