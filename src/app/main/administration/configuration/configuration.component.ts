import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from './configuration.service';
import { NewConfigurationComponent } from './new-configuration/new-configuration.component';
import { EditConfigurationComponent } from './edit-configuration/edit-configuration.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ConfigurationComponent implements OnInit {

  myform: FormGroup
  ConfigFormGroup: FormGroup
  myConfigform: FormGroup
  //  isActive: any
  //  isPatientSelected: boolean = false;
  autocompleteModeItem: string = "PatientType";
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModeDepartment: String = "Department";
  autocompleteModedoctorty: string = "ConDoctor";
  screenFromString = 'Common-form';
  autocompleteModeClass: string = "Class";


  DSServiceList = new MatTableDataSource<logervicedetail>();
  itemId = 0;
  dateTimeObj: any;
  Department = 0
  DoctorId = 0

  displayedColumns1: string[] = [
    'SystemConfigId',
    'Name',
    'SystemName',
    'IsInputField',
    'SystemInputValue'
  ];
  constructor(
    public _ConfigurationService: ConfigurationService,
    private formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    //    public dialogRef: MatDialogRef<EditConfigurationComponent>,
    //    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ConfigFormGroup = this.vConfigInsert()
    // this.myform = this._ConfigurationService.createConfigForm();
    this.myConfigform = this.vConfigFormInsert()
    this.getServiceList()

    this.serviceDetailsArray.push(this.createserviceDetail());

  }


  createserviceDetail(item: any = {}): FormGroup {
    console.log(item)
    return this.formBuilder.group({
      systemConfigId: [item.SystemConfigId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      systemCategoryId: [item.ConstantId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      systemName: [item.SystemName ?? '', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      isInputField: [item.IsInputField ? 1 : 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      systemInputValue: [item.SystemInputValue ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  get serviceDetailsArray(): FormArray {
    return this.ConfigFormGroup.get('serviceDetails') as FormArray;
  }

  vConfigInsert(): FormGroup {
    return this.formBuilder.group({
      serviceDetails: this.formBuilder.array([])

    });
  }

  vConfigFormInsert(): FormGroup {
    return this.formBuilder.group({
      Department: "",
      DoctorId: "",
      opdDepartment: "",
      opdDoctorId: "",
      InputFiled: 0,
      Inputvalue: 0,
      RegNo: 0,
      OPDNo: 0,
      OPSalesdisc: 0,
      IPSalesdisc: 0,

    });
  }
  onSubmit() {

    if (this.DSServiceList.data.length > 0) {

      Swal.fire({
        title: 'Confirm Action',
        text: 'Do you want to Change Configuration Setting ?',
        icon: 'warning',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#6c757d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        // cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {

          this.serviceDetailsArray.clear();
          this.DSServiceList.data.forEach(item => {
            this.serviceDetailsArray.push(this.createserviceDetail(item));
          });
          console.log(this.serviceDetailsArray.value)
          this._ConfigurationService.ConfigSave(this.serviceDetailsArray.value).subscribe((response) => {

            this.getServiceList()
          });
        }
       });

      }

    else {
      this.toastr.warning('please check List is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


  }


  getServiceList() {
    debugger
    var param = {
      "searchFields": [

      ],
      "mode": "SystemConfigList"
    }
    console.log(param)
    this._ConfigurationService.getloginaccessRetrive(param).subscribe(Menu => {
      console.log(Menu)
      this.DSServiceList.data = Menu as logervicedetail[];
      console.log(this.DSServiceList.data)
    });
  }

  selectChangeDept(event) {
    this.Department = event.value
  }

  selectChangeDoctor(event) {
    this.DoctorId = event.value
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
  onClear(val: boolean) {
    this.myform.reset();
    //  this.dialogRef.close(val);
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClose() {
    //  this.dialogRef.close();
  }

}


export class Congigdetail {
  LoginConfigId: any;
  Name: any;
  AccessCategoryId: any;
  AccessValueId: any;
  IsInputField: any;


  constructor(Congigdetail) {
    {
      this.LoginConfigId = Congigdetail.LoginConfigId || 0;
      this.Name = Congigdetail.Name || '';
      this.AccessCategoryId = Congigdetail.AccessCategoryId || 0;
      this.AccessValueId = Congigdetail.AccessValueId || 0;
      this.IsInputField = Congigdetail.IsInputField || 0;

    }
  }
}



export class logervicedetail {
  SystemConfigId: any;
  SystemCategoryId: any;
  SystemName: any;
  IsInputField: any;
  SystemInputValue: any;
  Name: any;

  constructor(logervicedetail) {
    {
      this.SystemConfigId = logervicedetail.SystemConfigId || 0;
      this.SystemCategoryId = logervicedetail.SystemCategoryId || 0;
      this.SystemName = logervicedetail.SystemName || 0;
      this.IsInputField = logervicedetail.IsInputField || 0;
      this.SystemInputValue = logervicedetail.SystemInputValue || 0;
      this.Name = logervicedetail.Name || '';

    }
  }
}
