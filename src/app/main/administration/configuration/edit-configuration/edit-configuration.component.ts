import { Component, Inject } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-edit-configuration',
  templateUrl: './edit-configuration.component.html',
  styleUrls: ['./edit-configuration.component.scss']
})
export class EditConfigurationComponent {
  myform: FormGroup
  isActive: any
  isPatientSelected: boolean = false;
  autocompleteModeItem: string = "PatientType";
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModeDepartment: String = "Department";
  autocompleteModedoctorty: string = "ConDoctor";
  screenFromString = 'Common-form';
  autocompleteModeClass: string = "Class";
  // autocompleteModeOpbillCashcounter: string = "CashCounter";
  // autocompleteModeopreceiptCashcounter: string = "CashCounter";
  // autocompleteModeoprefundCashcounter: string = "CashCounter";
  // autocompleteModeoprefundreeiptCashcounter: string = "CashCounter";


  // autocompleteModeIpbillCashcounter: string = "CashCounter";
  // autocompleteModeIpreceiptCashcounter: string = "CashCounter";
  // autocompleteModeIprefundCashcounter: string = "CashCounter";
  // autocompleteModeIprefundreeiptCashcounter: string = "CashCounter";
  // autocompleteModeIpAdvanceCashcounter: string = "CashCounter";
  DSLoginaccessList = new MatTableDataSource<Congigdetail>();
  DSServiceList = new MatTableDataSource<logervicedetail>();
  DSPathServiceList=new MatTableDataSource<logervicedetail>()
  itemId = 0;
  dateTimeObj: any;

   displayedColumns: string[] = [
      'LoginConfigId',
      'AccessCategoryId',
       'IsInputField',
      'AccessValueId',
     
      
    ];


  displayedColumns1: string[] = [
      'SystemConfigId',
      'SystemCategoryId',
      'SystemName',
      'IsInputField',
      'SystemInputValue',
    ];
  constructor(
    public _ConfigurationService: ConfigurationService,
    public dialogRef: MatDialogRef<EditConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myform = this._ConfigurationService.createConfigForm();
    if ((this.data?.configId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.myform.patchValue(this.data);
    }

    // this.getLoginaccessList()
     this.getServiceList()
  }

  onSubmit() {
    if (!this.myform.invalid) {
      console.log("Currency JSON :-", this.myform.value);

      this._ConfigurationService.ConfigSave(this.myform.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
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


  // getLoginaccessList() {

  //   var param = {
  //     "searchFields": [

  //     ],
  //     "mode": "LoginAccessConfigList"
  //   }
  //   console.log(param)
  //   this._ConfigurationService.getloginaccessRetrive(param).subscribe(Menu => {
  //   console.log(Menu)
  //     this.DSLoginaccessList.data = Menu as Congigdetail[];;
  //     console.log(this.DSLoginaccessList.data)
  //   });
  // }

    getServiceList() {

    var param = {
      "searchFields": [

      ],
      "mode": "SystemConfigList"
    }
    console.log(param)
    this._ConfigurationService.getloginaccessRetrive(param).subscribe(Menu => {
    console.log(Menu)
      this.DSServiceList.data = Menu as logervicedetail[];
      this.DSPathServiceList.data = Menu as logervicedetail[];
      
      console.log(this.DSServiceList.data)
    });
  }

    getChargesList(event) { }

getValidationMessages() {
  return {
    registrationNo: [],
    ipNo: [],
    opNo: [],
    patientType: [],
    cashCounterId: [],
    IPPrintName: [],
    IPPaperName: [],

    OPSalesdisc: [],
    IPSalesdisc: [],
    ChargeClass: []

  };
}
classstatus = false
onChangeClassEdit(event) {
  if (event.checked)
    this.classstatus = true
  else
    this.classstatus = false
}
ApiURL: any;
getSelectedClassObj(event) {
  this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="
}

selectChangeItem(obj: any) {
  console.log(obj);
  this.itemId = obj
}

getOptionTextPatient(option) {
  return option && option.PatientType ? option.PatientType : '';
}


onChangePrintReg(event) {

}
onChangePrintAfterReg(event) {

}
onChangeIPDAdd(event) {

}

Isprint = false
Isprint1 = false
Isprint2 = false
onChangeprint(event) {
  debugger
  if (event.checked)
    this.Isprint = true
  else
    this.Isprint = false
}

onChangeprintIp(event) {
  if (event.checked)
    this.Isprint1 = true
  else
    this.Isprint1 = false
}
onChangeprintphar(event) {
  if (event.checked)
    this.Isprint2 = true
  else
    this.Isprint2 = false
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
  this.dialogRef.close(val);
}

getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
}


onClose() {
  this.dialogRef.close();
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
   

    constructor(logervicedetail) {
        {
            this.SystemConfigId = logervicedetail.SystemConfigId || 0;
            this.SystemCategoryId = logervicedetail.SystemCategoryId || 0;
            this.SystemName = logervicedetail.SystemName || 0;
            this.IsInputField = logervicedetail.IsInputField || 0;
            this.SystemInputValue = logervicedetail.SystemInputValue || 0;
         
        }
    }
}
