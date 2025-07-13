import { Component, Inject } from '@angular/core';
import { CompanyMasterService } from '../company-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Servicedetail } from '../../service-master/service-master.component';
import { FormBuilder, FormGroup, UntypedFormBuilder } from '@angular/forms';
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
  tariffId = 0
  classId = 0
  serviceName: "%"
  compobj = new CompanyMaster({});
  CompanyId = 0
  autocompleteModetypeName: string = "Service";
  autocompleteModeclass2: string = "Class";

  DSComwiseServiceList = new MatTableDataSource<Servicedetail>();
  displayedColumns1: string[] = [
    'Code',
    'ServiceName',
    'Action'
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
    this.getServicecompwiseList(event)
    if (this.data) {
      this.compobj = this.data
      console.log(this.compobj.traiffId)
      this.CompanyId = this.compobj.companyId
      this.tariffId = this.compobj.traiffId
      // this.compwiseserForm.get("TariffId1").setValue(this.compobj.traiffId)
      this.compwiseserForm.get("companyName").setValue(this.compobj.companyName)
    }
  }

  getServicecompwiseList(event) {

    // let classId = this.compwiseserForm.get("ClassId2").value || 1
    let serviceName = this.compwiseserForm.get("ServiceName").value || "%"
    debugger
    var param =
    {
      "searchFields": [
        {
          "fieldName": "ServiceName",
          "fieldValue": String(serviceName),
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

  printserviceName=''
    gettableServName(event) {
        this.printserviceName = event.text
        // this.selectdiscservicelist(event)
    }

    onSubmit() {

        if (!this.compwiseserForm.invalid) {

            console.log("Company Insert:-", this.compwiseserForm.value);

            this._CompanyMasterService.companyMasterSave(this.compwiseserForm.value).subscribe((response) => {
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

        onClear(val: boolean) {
        this.compwiseserForm.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.compwiseserForm.reset();
        this.dialogRef.close();
    }

}
