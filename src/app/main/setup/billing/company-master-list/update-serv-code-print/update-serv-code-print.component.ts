import { Component, Inject } from '@angular/core';
import { CompanyMasterService } from '../company-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Servicedetail } from '../../service-master/service-master.component';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder } from '@angular/forms';
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
  tariffId = 0
  classId = 0
  serviceName="%"
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
    this.serviceForm=this._CompanyMasterService.createcompwiseservForm();
   
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
          "fieldValue": String(this.compobj.traiffId),
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

  createserviceDetails(item: any = {}): FormGroup {
    return this._formBuilder.group({
      serviceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.tariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: [item.classId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      classRate: [item.classRate || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  get serviceDetailsArray(): FormArray {
    return this.serviceForm.get('serviceDetails') as FormArray;
  }


  onSubmit() {

    if (!this.compwiseserForm.invalid) {

      this.serviceDetailsArray.clear();
      this.DSComwiseServiceList.data.forEach(item => {
        console.log(item)
        this.serviceDetailsArray.push(this.createserviceDetails(item));
      });

      console.log("Company Insert:-", this.compwiseserForm.value);

      this._CompanyMasterService.updateservicecodeSave(this.compwiseserForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
    else {
      this.toastr.warning('please check form is invalid', 'Warning !', {
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
