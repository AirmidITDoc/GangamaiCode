import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { UntypedFormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { error } from 'console';
import { element } from 'protractor';

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
    insert_TemplateHObj['isAddBy'] =  this._loggedService.currentUserValue.userId;
    insert_TemplateHObj['isDeleted'] = 0;
    insert_TemplateHObj['oP_IP_Type'] =  0;

    let insert_TemplateDObj = [];
    this.chargelist.forEach(element =>{
      let insert_TemplateD = {};
      insert_TemplateD['presId'] = 0;
      insert_TemplateD['date'] = formattedDate;
      insert_TemplateD['classID'] =  0;
      insert_TemplateD['genericId'] = 0;
      insert_TemplateD['drugId'] =  element.DrugId || 0;
      insert_TemplateD['doseId'] = element.DoseId || 0;
      insert_TemplateD['days'] = element.Days || 0;
      insert_TemplateD['instructionId'] =  0;
      insert_TemplateD['qtyPerDay'] = element.QtyPerDay || 0;
      insert_TemplateD['totalQty'] =  (element.Days * element.QtyPerDay) || 0
      insert_TemplateD['instruction'] = element.Instruction || '';
      insert_TemplateD['remark'] = element.Instruction || '';
      insert_TemplateD['isEnglishOrIsMarathi'] =  true;
      insert_TemplateDObj.push(insert_TemplateD)
    }); 

    let delete_PrescriptionTemplate = {};
    delete_PrescriptionTemplate['presId'] = 0; 

    let submitData ={
      "delete_PrescriptionTemplate":delete_PrescriptionTemplate,
      "insert_TemplateH":insert_TemplateHObj,
      "insert_TemplateD":insert_TemplateDObj
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
    this._matDialog.closeAll(); 
  }

  onClear(){

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
 