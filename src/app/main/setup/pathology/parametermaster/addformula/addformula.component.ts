import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ParametermasterService } from '../parametermaster.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { PathparameterMaster } from '../parametermaster.component';
import Swal from 'sweetalert2';
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
    // debugger
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
     this.paraname=this._ParameterService.formulaform.get("ParameterId").value.ParameterName;
    console.log(this.paraname)
  }
  onClear() {
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
// debugger
    if (!this._ParameterService.formulaform.invalid) {

        var mdata = {
            "parameterId":this.ParameterId,
            "formula":this._ParameterService.formulaform.get("Formula").value
          };

          console.log('json mdata:', mdata);

        this._ParameterService.formulaUpdate(mdata).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClose();
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    else {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  onClose() {
    this.dialogRef.close();
    this._ParameterService.formulaform.reset();
  }
  getValidationMessages() {
    return {
      ParameterId:[
        { name: "required", Message: "Parameter Name is required" }
      ]
    };
  }
}
