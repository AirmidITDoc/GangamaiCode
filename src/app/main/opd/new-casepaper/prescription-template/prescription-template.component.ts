import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  
  constructor( 
    private _CasepaperService: CasepaperService, 
    private _formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
  ) { }

  ngOnInit(): void {
    this.TemplateFomr(); 
  }

  TemplateFomr() {
    this.TemplateForm = this._formBuilder.group({ 
      TemplateName:'', 
    });
  } 


 
 
 
 
  onSave(){
   
    if(this.vTemplatename == '' || this.vTemplatename == undefined || this.vTemplatename == null){ 
      this.toastr.warning('Please enter Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 

  }
  onClose(){
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
 