import { Component, Inject } from '@angular/core';
import { CompanyMasterService } from '../company-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Servicedetail } from '../../service-master/service-master.component';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyMaster } from '../company-master-list.component';

@Component({
  selector: 'app-update-serv-code-print',
  templateUrl: './update-serv-code-print.component.html',
  styleUrls: ['./update-serv-code-print.component.scss']
})
export class UpdateServCodePrintComponent {
  compwiseserForm: FormGroup;
  serviceForm: FormGroup;
  serviceInsertForm: FormGroup;
  tariffId = 0
  classId = 0
  serviceName = "%"
  compobj = new CompanyMaster({});
  CompanyId = 0
  autocompleteModetypeName: string = "Service";
  autocompleteModeclass2: string = "Class";

  DSComwiseServiceList = new MatTableDataSource<Servicedetail>();
  displayedColumns1: string[] = [
    'ServiceId',
    'ServiceName',
    'Company Code',
    'PrintName',
    'checkbox',
    // 'Action'
  ];

  constructor(
    public _CompanyMasterService: CompanyMasterService,
    public dialogRef: MatDialogRef<UpdateServCodePrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: UntypedFormBuilder,
    private _formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.compwiseserForm = this._CompanyMasterService.createcompwiseservForm();
    this.serviceInsertForm = this.createservCompany();

    this.servicearray.push(this.createserviceDetails());


    if (this.data) {
      this.compobj = this.data
      console.log(this.compobj.traiffId)
      this.CompanyId = this.compobj.companyId
      this.tariffId = this.compobj.traiffId
      // this.compwiseserForm.get("TariffId1").setValue(this.compobj.traiffId)
      // this.compwiseserForm.get("companyName").setValue(this.compobj.companyName)
    }
    this.getServicecompwiseList()
  }

  createservCompany(): FormGroup {
    return this._formBuilder.group({
      userId: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      serviceWise: this._formBuilder.array([])

    });
  }

  createserviceDetails(item: any = {}): FormGroup {
    console.log(item)
    return this._formBuilder.group({
      serviceId: [item.ServiceId, [this._FormvalidationserviceService.onlyNumberValidator()]],

      tariffId: [this.tariffId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      companyCode: [item.companyCode || "", [Validators.maxLength(50),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      companyServicePrint: [item.companyServicePrint || "", [Validators.maxLength(50),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      isInclusionOrExclusion: [item.isInclusionOrExclusion || false],


    });
  }

  get servicearray(): FormArray {
    return this.serviceInsertForm.get('serviceWise') as FormArray;
  }


  getServicecompwiseList() {
    debugger
    var param =
    {
      "searchFields": [
        {
          "fieldName": "ServiceName",
          "fieldValue": String(this.serviceName),
          "opType": "Equals"
        },
        {
          "fieldName": "TariffId",
          "fieldValue": String(this.tariffId),
          "opType": "Equals"
        }
      ],
      "mode": "CompanyWiseServiceList"
    }

    console.log(param)
    this._CompanyMasterService.getservicMasterListRetrive(param).subscribe(data => {
      this.DSComwiseServiceList.data = data as Servicedetail[];
      console.log(this.DSComwiseServiceList.data)
    });

  }

  selectService(event) {
    this.serviceName = event.text
    this.getServicecompwiseList()
  }

  printserviceName = ''
  gettableServName(event) {
    this.printserviceName = event.text
    // this.selectdiscservicelist(event)
  }


  onSubmit() {

    if (this.DSComwiseServiceList.data.length > 0) {

      this.servicearray.clear();
      this.DSComwiseServiceList.data.forEach(item => {
        console.log(item)
        this.servicearray.push(this.createserviceDetails(item));
      });

      console.log("Company Insert:-", this.serviceInsertForm.value);

      this._CompanyMasterService.updateservicecodeSave(this.serviceInsertForm.value).subscribe((response) => {
        this.dialogRef.close()
      });
    }
    else {
      this.toastr.warning('please check Service Table is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  getChargesList(event) { }

  onClear(val: boolean) {
    this.compwiseserForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.compwiseserForm.reset();
    this.dialogRef.close();
  }

}
