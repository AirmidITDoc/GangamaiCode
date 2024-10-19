import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-template-desc',
  templateUrl: './new-template-desc.component.html',
  styleUrls: ['./new-template-desc.component.scss']
})
export class NewTemplateDescComponent implements OnInit {
  Header: string;
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
      this.Header = e.target.innerHTML;
  }
  
  constructor(public _matDialog: MatDialog, public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewTemplateDescComponent>,
    private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit(): void {
  }

  onClear(){}
  onClose(){
    this._matDialog.closeAll();
  }
  onSubmit(){

    
  }
}
