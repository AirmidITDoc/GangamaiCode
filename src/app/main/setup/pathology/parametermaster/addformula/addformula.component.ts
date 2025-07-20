import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ParametermasterService } from '../parametermaster.service';
interface Result {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-addformula',
  templateUrl: './addformula.component.html',
  styleUrls: ['./addformula.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddformulaComponent implements OnInit {
  paramterList: any = [];
  filteredOptionsParameter: Observable<string[]>;
  isparaSelected: boolean = false;
  paraname: any = ''
  finalformula: any = "";
  oprator: any;
  optionsPara: any[] = [];
  registerObj: any;
  ParameterId: any;
  paranamenew: any;
  vParameter: any;
  autocompleteParameter: string = "Parameter";
  VFormulaId:any;

  results: Result[] = [
    { value: '1', viewValue: '+' },
    { value: '2', viewValue: '-' },
    { value: '3', viewValue: '*' },
    { value: '4', viewValue: '/' },
    { value: '5', viewValue: '%' },
    { value: '6', viewValue: '-' },
    { value: '7', viewValue: '(' },
    { value: '8', viewValue: ')' },
    { value: '9', viewValue: ' ' },
    { value: '9', viewValue: '^' }
  ];



  constructor(
    public _ParameterService: ParametermasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<AddformulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // 
    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data.registerObj;
      this.ParameterId = this.registerObj.parameterId

      this.vParameter = this.registerObj.parameterName
      this.finalformula = this.registerObj.formula
      this.VFormulaId=this.registerObj.formulaId
    }
  }

  parameterData=""
  selectChangeParameter(obj: any) {
    console.log("Parameter:",obj);
    this.parameterData=obj.text;
  }

  onChangeparaList(option) {
    
    this.paraname = option.ParameterName
     this.paraname=this._ParameterService.formulaform.get("Parameter").value.ParameterName;
    console.log(this.paraname)
  }
  onClear(p0: boolean) {
    this._ParameterService.formulaform.reset();
  }

  addoprator(event) {
    this.oprator = event
  }
  
  addoprator1() {
    this.paraname=this.parameterData
    this.paranamenew = "{{" + this.paraname + "}}"
    this.finalformula = this.finalformula + this.paranamenew + this.oprator;
  }

  onSubmit() {
// 
 console.log(this._ParameterService.formulaform.value)
 const payload=this._ParameterService.formulaform.value
delete payload.parameterName
delete payload.formulaId
delete payload.Parameter
 
 console.log(this._ParameterService.formulaform.value)
    if (!this._ParameterService.formulaform.invalid) {
           
            this._ParameterService.getParameteformulaedit(this._ParameterService.formulaform.value).subscribe((response) => {
                this.dialogRef.close()
            });
        } {
            let invalidFields = [];
            if (this._ParameterService.formulaform.invalid) {
                for (const controlName in this._ParameterService.formulaform.controls) {
                    if (this._ParameterService.formulaform.controls[controlName].invalid) {
                        invalidFields.push(`paraname Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }
    }
  onClose() {
    this.dialogRef.close();
    this._ParameterService.formulaform.reset();
  }
  getValidationMessages() {
    return {
      Parameter:[
        { name: "required", Message: "Parameter Name is required" }
      ]
    };
  }
}
