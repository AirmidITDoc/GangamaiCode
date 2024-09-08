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
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
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
  parameterName: any;

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
  ) {
    this.getParameterNameCombobox();
    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data.registerObj;
      this.ParameterId = this.registerObj.ParameterID
      this.parameterName = this.registerObj.ParameterName
      this.finalformula = this.registerObj.Formula
    }
  }

  ngOnInit(): void {

    this.getParameterNameCombobox();
  }



  getParameterNameCombobox() {

    var m_data = {
      ParameterName: this._ParameterService.formulaform.get("ParameterId").value + "%" || "%",
    };

    this._ParameterService.getParameterMasterforformulaList(m_data).subscribe((data) => {
      this.paramterList = data;
      this.optionsPara = this.paramterList.slice();
      this.filteredOptionsParameter = this._ParameterService.formulaform.get('ParameterId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterParameter(value) : this.paramterList.slice()),
      );

    });
  }


  private _filterParameter(value: any): string[] {
    if (value) {
      const filterValue = value && value.ParameterName ? value.ParameterName.toLowerCase() : value.toLowerCase();
      return this.optionsPara.filter(option => option.ParameterName.toLowerCase().includes(filterValue));
    }

  }



  getOptionTextparameter(option) {
    if(option){
    this.paranamenew = "{{" + option.ParameterName + "}}"
     this.paraname = option.ParameterName}
    return option && option.ParameterName ? option.ParameterName : '';

  }
  onChangeparaList(option) {
    debugger
    this.paraname = option.ParameterName
    // this.paraname=this._ParameterService.formulaform.get("ParameterId").value.ParameterName;
    console.log(this.paraname)
  }
  onClear() {
    this._ParameterService.formulaform.reset();

  }

  addoprator(event) {
    this.oprator = event

  }
  addoprator1() {
    this.paraname=this._ParameterService.formulaform.get("ParameterId").value.ParameterName
    this.paranamenew = "{{" + this.paraname + "}}"
    this.finalformula = this.finalformula + this.paranamenew + this.oprator;

  }
  onSubmit() {

    let Query = "Update M_PathParameterMaster set Formula=" + "'" + this.finalformula + "'" + "where ParameterID=" + this.ParameterId;
    console.log(Query);

    this._ParameterService.deactivateTheStatus(Query)
      .subscribe((data) => {
        Swal.fire('Changed!', 'Parameter Formula has been Changed.', 'success');

      }, (error) => {

        Swal.fire('Error!', 'Failed to Formula  Parameter status.', 'error');
      });

    this.dialogRef.close();
  }
  onClose() {
    this.dialogRef.close();
    this._ParameterService.formulaform.reset();
  }
}
