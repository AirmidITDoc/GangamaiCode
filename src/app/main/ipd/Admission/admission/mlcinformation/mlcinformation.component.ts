import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../admission.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mlcinformation',
  templateUrl: './mlcinformation.component.html',
  styleUrls: ['./mlcinformation.component.scss']
})
export class MLCInformationComponent implements OnInit {

  MlcInfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  date: string;
  dateValue: any = new Date().toISOString();
  MLCId = 0;
  registerObj = new MlcDetail({})

  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<MLCInformationComponent>,
    private router: Router
  ) {
    this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {

    this.MlcInfoFormGroup = this.createmlcForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.AdmissionId = this.selectedAdvanceObj.AdmissionID;
      console.log(this.selectedAdvanceObj);
      this.MLCId = this.data.mlcid

    }
    this.MlcInfoFormGroup = this.createmlcForm();
  }

  createmlcForm() {
    return this.formBuilder.group({

      mlcid: 0,
      admissionId: 0,
      mlcno: "%",
      reportingDate: "2024-09-18T11:24:02.655Z",
      reportingTime: "2024-09-18T11:24:02.655Z",
      authorityName: "",
      buckleNo: "",
      policeStation: ""
    });
  }


  filteredOptionsMLC: Observable<string[]>;
  MLCList: any = [];

  optionsMLC: any[] = [];



  onClose() {
    this.dialogRef.close();
  }



  onSubmit() {

    this.submitted = true;
    this.isLoading = 'submit';

    if (this.MLCId == 0) {
      var m_data = {
        "insertMLCInfo": this.MlcInfoFormGroup.value

      }
      console.log(m_data);

      this._AdmissionService.MlcInsert(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear();
      }, (error) => {
        this.toastr.error(error.message);
      });



    }
    else {

      var m_data = {
        "insertMLCInfo": this.MlcInfoFormGroup.value

      }
      console.log(m_data);

      this._AdmissionService.MlcInsert(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear();
      }, (error) => {
        this.toastr.error(error.message);
      });

    }

  }

  getValidationMessages() {
    return {
      mlcno: [
        { name: "required", Message: "mlcno is required" }
      ],
      authorityName: [
        { name: "required", Message: "authorityName is required" }
      ],
      buckleNo: [
        { name: "required", Message: "buckleNo is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ]
    };
  }


  getMLCdetailview(Id) {
    setTimeout(() => {
      let param = {
          "searchFields": [
              {
                  "fieldName": "FromDate",
                  "fieldValue": "12-12-2024",//this.datePipe.transform(this.fromDate,"dd-MM-yyyy"),//"10-01-2024",
                  "opType": "13"
              },
              {
                  "fieldName": "ToDate",
                  "fieldValue": "12-12-2025",//this.datePipe.transform(this.toDate,"dd-MM-yyyy"),//"12-12-2024",
                  "opType": "13"
              }
          ],
          "mode": "RegistrationReport"
      }
      console.log(param)
      this._AdmissionService.getReportView(param).subscribe(res => {
          const matDialog = this._matDialog.open(PdfviewerComponent,
              {
                  maxWidth: "85vw",
                  height: '750px',
                  width: '100%',
                  data: {
                      base64: res["base64"] as string,
                      title: "MLC Detail  Viewer"

                  }

              });

          matDialog.afterClosed().subscribe(result => {

          });
      });

  }, 100);
  }
  onClear() { }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}



export class MlcDetail {
  mlcid: any;
  admissionId: any;
  mlcno: any;
  reportingDate: "2024-09-18T11:24:02.655Z";
  reportingTime: "2024-09-18T11:24:02.655Z";
  authorityName: any;
  buckleNo: any;
  policeStation: any;
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(MlcDetail) {
    {
      this.mlcid = MlcDetail.mlcid || 0;
      this.admissionId = MlcDetail.admissionId || '';
      this.mlcno = MlcDetail.mlcno || '';
      this.reportingDate = MlcDetail.reportingDate || '';
      this.reportingTime = MlcDetail.reportingTime || '';
      this.authorityName = MlcDetail.authorityName || '';
      this.buckleNo = MlcDetail.buckleNo || '';
      this.policeStation = MlcDetail.policeStation || '';

    }
  }
}