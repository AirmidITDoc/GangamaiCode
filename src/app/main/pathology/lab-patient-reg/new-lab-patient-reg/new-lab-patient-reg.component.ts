import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LabPatientList, LabRequest } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-lab-patient-reg',
  templateUrl: './new-lab-patient-reg.component.html',
  styleUrls: ['./new-lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabPatientRegComponent {
  myForm: FormGroup
  searchFormGroup: FormGroup
  screenFromString = 'Common-Form';
  registerObj = new LabPatientList({});
  RegId = 0;
  CityName = ""
  vRegNo: any;
  vTariffId: any = 0;
  vClassId: any = 0;
  vRegId: any;
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  dstable1 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _labPatientRegService: LabPatientRegService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabPatientRegComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this._labPatientRegService.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.getServiceList();
  }

  dateTimeObj: any;
  minDate = new Date();
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjextPatient(event: any): void {
    console.log(event)
  }

  // called this fun becasue externel api only provide minimum data so i cant featch in field
  getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {
      setTimeout(() => {
        this._labPatientRegService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log("Searched data:", this.registerObj)
        });
      }, 500);
    }
  }

  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = this.myForm.get("IsPathRad").value || "1"
    // if (this.vRegNo) {
      var param = {
        "first": 0,
        "rows": 10,
        "sortField": "ServiceId",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "ServiceName",
            "fieldValue": ServiceName,
            "opType": "Equals"
          },
          {
            "fieldName": "TariffId",
            "fieldValue": String(this.vTariffId),
            "opType": "Equals"
          },
          {
            "fieldName": "IsPathRad",
            "fieldValue": String(IsPathRad),
            "opType": "Equals"
          },
          {
            "fieldName": "ClassId",
            "fieldValue": String(this.vClassId),
            "opType": "Equals"
          }
        ],
        "Columns": [],
        "exportType": "JSON"
      }
      console.log(param)

      this._labPatientRegService.getserviceList(param).subscribe(Menu => {

        this.dsLabRequest2.data = Menu.data as LabRequest[];
        this.dsLabRequest2.sort = this.sort;
        this.dsLabRequest2.paginator = this.paginator;
        console.log(this.dsLabRequest2.data)
      });
    // } else {
    //   if (!this.myForm.get('regId')?.value && !this.vRegId) {
    //     this.toastr.warning('Please Select Patient', 'Warning!', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
  }

  onSaveEntry(row) {
    let doctorid = 0;
    const formValue = this.myForm.value
    if (this.isDoctor) {
      if ((formValue.doctorId == '' || formValue.doctorId == null || formValue.doctorId == '0')) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (formValue.doctorId)
        doctorid = this.myForm.get("doctorId")?.value ?? 0;
    }

    this.dstable1.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.serviceId);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }

      this.dstable1.data = this.chargeslist;
      this.dstable1.sort = this.sort;
      this.dstable1.paginator = this.paginator;
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
    else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ServiceId: row.serviceId,
        ServiceName: row.serviceName,
        Price: row.price || 0
      });

    console.log(this.chargeslist);
    this.dstable1.data = this.chargeslist;
    this.dstable1.sort = this.sort;
    this.dstable1.paginator = this.paginator;
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

  selectChangedepartment(obj: any) {
    if (obj.value) {
      this._labPatientRegService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._labPatientRegService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        // debugger
        this.ddlDoctor.options = data;
        // this.ddlDoctor.bindGridAutoComplete();
        const incomingDoctorId = obj.doctorId;
        console.log("Id:", incomingDoctorId)
        setTimeout(() => {
          this.ddlDoctor.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.ddlDoctor.SetSelection(matchedDoctor.value);
              // this.myForm.get('doctorId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
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

  onNewSave() {

  }

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }
}
