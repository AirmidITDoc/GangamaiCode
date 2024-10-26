import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TempDescService } from '../temp-desc.service';
import Swal from 'sweetalert2';
import { TemplateMaster } from '../template-description.component';

@Component({
  selector: 'app-new-template-desc',
  templateUrl: './new-template-desc.component.html',
  styleUrls: ['./new-template-desc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewTemplateDescComponent implements OnInit {
  Header: string;
  tempdesc:any='';
  TemplateId:any=0;
  TemplateName:any;
  registerObj = new TemplateMaster({});

  public tools: object = {
    type: 'MultiRow',
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'CreateTable', '|',
      'CreateLink', 'Image', '|',
      'Indent', 'Outdent', '|',
      'ClearFormat', '|', 'FullScreen','CreateTable'
      // 'SourceCode',
    ]
  };
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
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      uploadUrl: 'v1/image',
      

  };
  onBlur(e: any) {
      this.registerObj.TemplateDescription = e.target.innerHTML;
  }
  
  constructor(public _matDialog: MatDialog, public toastr: ToastrService, public  _TempDescService:TempDescService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewTemplateDescComponent>,
    private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj=this.data.registerObj;
      this.TemplateId=  this.registerObj.TemplateId
    }
  }

  onClear(){}
  onClose(){
    this._matDialog.closeAll();
  }
  onSubmit(){

    // if ((this.TemplateName == '' || this.TemplateName == null || this.TemplateName == undefined)) {
    //   this.toastr.warning('Please select valid Template ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if(this._TempDescService.myform.get("Tempdesc").value ==''){
    //   this.toastr.warning('Please Enter Template desc ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }


if(this.TemplateId==0){
    let tempobj = {};
    tempobj['templateName'] = this._TempDescService.myform.get("TemplateName").value || '',
    tempobj['templateDescription'] = this._TempDescService.myform.get("Tempdesc").value || ''
   
      let submitData = {
        "insertTempDescParam": tempobj
      }
    
    this._TempDescService.templateInsert(submitData).subscribe(data => {
      if (data) {
        Swal.fire('Template Added !', 'Record Added Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Template not Added', 'error');
      }
    },
   
    );
  }else{
    let tempobj = {};
    tempobj['templateId'] =  this.TemplateId
    tempobj['templateName'] = this._TempDescService.myform.get("TemplateName").value || '',
    tempobj['templateDescription'] = this._TempDescService.myform.get("Tempdesc").value || ''
   
      let submitData = {
        "updateTempDescParam": tempobj,
      }
    
    this._TempDescService.TemplateUpdate(submitData).subscribe(data => {
      if (data) {
        Swal.fire('Template Updated!', 'Record updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Template not Updated', 'error');
      }
    },
   
    );
  }


  
  }
}
