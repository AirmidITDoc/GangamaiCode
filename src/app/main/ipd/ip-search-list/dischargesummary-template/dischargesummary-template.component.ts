import { Component, OnInit } from '@angular/core';
import { IPSearchListService } from '../ip-search-list.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-dischargesummary-template',
  templateUrl: './dischargesummary-template.component.html',
  styleUrls: ['./dischargesummary-template.component.scss']
})
export class DischargesummaryTemplateComponent implements OnInit {
  selectedAdvanceObj: AdvanceDetailObj;
  discSummary:FormGroup;
  vTemplateDesc:any;
  vTemplateId:any;
  TemplateList:any=[];
  istemplateSelected: boolean = false;
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
      'ClearFormat', '|', 'FullScreen',
      // 'SourceCode',
    ]
  };


  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargesummaryTemplateComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.discSummary=this.createRadiologytemplateForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
    }
    this.getTemplateList();
  }

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
     
    });
  }

  filteredOptionstemplate: Observable<string[]>;
  optionstemplate: any[] = [];
  getTemplateList() {
    this._IpSearchListService.gettemplateCombo().subscribe(data => {
        this.TemplateList = data;
        console.log(this.TemplateList)
        this.optionstemplate = this.TemplateList.slice();
        this.filteredOptionstemplate = this.discSummary.get('TemplateId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filtertemp(value) : this.TemplateList.slice()),
        );

    });
}
private _filtertemp(value: any): string[] {
  if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.optionstemplate.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
  }

}
getOptionTexttemplate(option) {
  return option && option.TemplateName ? option.TemplateName : '';
}
onBlur(e:any){
  this.vTemplateDesc=e.target.innerHTML;
} 


  onSubmit(){}
  onAddTemplate(){
 debugger
    this.vTemplateDesc=this.discSummary.get('TemplateId').value.TemplateDescription || ''
 
  }
  onClear(){}
  onClose(){}
}
