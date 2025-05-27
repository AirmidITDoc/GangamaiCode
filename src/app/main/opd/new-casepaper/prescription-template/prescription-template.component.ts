import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr';
import { CasepaperService } from '../casepaper.service';

// interface Prescription {
//   date: string;
//   medication: string;
//   dosage: string;
// }

// interface Patient {
//   name: string;
//   age: number;
//   gender: string;
//   prescriptions: Prescription[];
// }


@Component({
  selector: 'app-prescription-template',
  templateUrl: './prescription-template.component.html',
  styleUrls: ['./prescription-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionTemplateComponent implements OnInit {
 
  TemplateForm:FormGroup; 
  sIsLoading: string = ''; 
  currentDate = new Date 
  vRemark: any; ; 
  vTemplatename:any;  
  registerObj:any; 
  
  constructor( 
    private _CasepaperService: CasepaperService, 
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
    public dialogRef: MatDialogRef<PrescriptionTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
chargelist:any=[];
  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      this.chargelist =  this.registerObj 
      console.log(this.registerObj)
    }
    this.TemplateFomr(); 

  }

  TemplateFomr() {
    this.TemplateForm = this._formBuilder.group({ 
      TemplateName:'', 
    });
  } 
  savebtn:boolean=false;
  onSave(){
    
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');  

    if(this.vTemplatename == '' || this.vTemplatename == undefined || this.vTemplatename == null){ 
      this.toastr.warning('Please enter Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }  
    this.savebtn = true;
    let insert_TemplateHObj = {};
    insert_TemplateHObj['presId'] = 0;
    insert_TemplateHObj['presTemplateName'] = this.TemplateForm.get('TemplateName').value || '';
    insert_TemplateHObj['isActive'] = true;
    insert_TemplateHObj['opIpType'] =  0;
    insert_TemplateHObj['isAddBy'] =  this._loggedService.currentUserValue.userId || 0;
    insert_TemplateHObj['isUpdatedBy'] = this._loggedService.currentUserValue.userId || 0;

    let insert_TemplateDObj = [];
    this.chargelist.forEach(element =>{
      let insert_TemplateD = {};
      insert_TemplateD['presId'] = 0;
      insert_TemplateD['date'] = formattedDate;
      insert_TemplateD['classId'] =   element.classID || 0;
      insert_TemplateD['genericId'] =  element.genericId || element.GenericId;
      insert_TemplateD['drugId'] =  element.drugId || element.DrugId;
      insert_TemplateD['doseId'] = element.doseId || element.DoseId;
      insert_TemplateD['days'] = element.days || element.Days;
      insert_TemplateD['instructionId'] =  element.instructionId || 0;
      insert_TemplateD['qtyPerDay'] = element.qtyPerDay || element.QtyPerDay;
      insert_TemplateD['totalQty'] =  (element.days * element.qtyPerDay) || (element.Days * element.QtyPerDay)
      insert_TemplateD['instruction'] = element.instruction || element.Instruction;
      insert_TemplateD['remark'] = element.instruction || element.Instruction;
      insert_TemplateD['isEnglishOrIsMarathi'] =  true;
      insert_TemplateDObj.push(insert_TemplateD)
    }); 

    let submitData ={
      "prescriptionOPTemplate":insert_TemplateHObj,
      "presTemplate":insert_TemplateDObj
    }
    console.log(submitData);
    this._CasepaperService.SavePrescriptionTemplate(submitData).subscribe(response =>{
      if(response){
        this.toastr.success('Record Successfuly saved','Saved !',{
          toastClass: 'tostr-tost custom-toast-success',
        })
        this.onClose();
        this.savebtn = false;
      }else{
        this.toastr.error('Record not saved','Error !',{
          toastClass: 'tostr-tost custom-toast-error',
        })
         this.savebtn = true;
      }
    },error =>{
      this.toastr.error('Please Check Api Error','Error !',{
        toastClass: 'tostr-tost custom-toast-error',
      })
      this.savebtn = true;
    }
  );

  }
  onClose(){
    this.vTemplatename = '';
    // this.dialogRef.close();
    this._matDialog.closeAll();
  }

  onClear(){
    this.vTemplatename = '';
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  add: boolean = false;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }

 
}
 