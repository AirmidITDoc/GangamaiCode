
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { element } from 'protractor';
import { RadopPcpndService } from '../radop-pcpnd.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-new-pcpnd',
  templateUrl: './new-pcpnd.component.html',
  styleUrls: ['./new-pcpnd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPcpndComponent {

  personalFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  IndicationsFormGroup: FormGroup

  finalFormGroup: FormGroup;
  finalIndications: FormGroup

  PatientName: any = '';
  MobileNo: any;
  DoctorName: any;
  RegId: any = '';
  IPMedID: any;
  OPDNo: any;
  RegNo: any;
  IPDNo: any;
  Patientdetails: any;
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;

  vupdate: boolean = true;
  OP_IP_Id: any = 0;
  OP_IPType: any = 1;
  HospitalId: any = 0;
  wardId: any = 0;
  bedId: any = 0;
  isExpanded1 = true;
  isExpanded3 = false;
  registerObj: any
  dateTimeObj: any;

  vNoninvasive: any;
  roomName = ''
  bedName = ''
  tariffName = ''
  departmentName = ''
  Patientobj: any;
  vpcpndtprocessId = 0

  displayedColumns: string[] = [
    'descvalue',
    'descName',

  ];

  DSIndicationList = new MatTableDataSource<Indicationdetail>();
  DSIndicationList1 = new MatTableDataSource<Indicationdetail>();
  IndicationList = new MatTableDataSource<Indicationdetail>();

  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModeAnyOther: string = "PCPNDTAnyother";
  screenFromString = 'Common-form';
  constructor(
    public _RadopPcpndService: RadopPcpndService,
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewPcpndComponent>,
    public _matDialog: MatDialog,
    private _ActRoute: Router, private _FormvalidationserviceService: FormvalidationserviceService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    public matDialog: MatDialog,
    private commonService: PrintserviceService, private advanceDataStored: AdvanceDataStored,
    private _configue: ConfigService, private accountService: AuthenticationService,
    public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

  ) { }
  ClinicName: any
  vresultDate = new Date();
  vprocedureDate = new Date();
  vconsentDate = new Date();
  vprocessDate = new Date();

  ngOnInit(): void {


    this.searchFormGroup = this.createSearchForm();

    this.personalFormGroup = this.createFinalProcessForm();
    this.personalFormGroup.patchValue(this.data)
    this.personalFormGroup.markAllAsTouched();
    this.getIndList()


    if ((this.data?.pcpndtProcessId ?? 0) > 0) {
      console.log(this.data)
      this.vupdate = false
      this.data = this.data
      this.registerObj = this.data
      this.RegId = this.registerObj.opipid
      this.PatientName = this.registerObj.patientName;
      this.OP_IP_Id = this.registerObj.opipid;
      this.OP_IPType=this.registerObj.opipType
      this.DoctorName = this.registerObj.condDoctor;

      this.vresultDate = new Date(this.registerObj.resultDate);
      this.vprocedureDate = new Date(this.registerObj.procedureDate);
      this.vconsentDate = new Date(this.registerObj.consentDate);
      this.vprocessDate = new Date(this.registerObj.processDate);

      console.log(this.registerObj?.invasiveDoctorId)

      this.personalFormGroup.get("abhanumber").setValue((this.registerObj?.abhaNumber))

      this.personalFormGroup.get("address").setValue(
        this.registerObj?.abhaAddress
          ? String(this.registerObj.abhaAddress)
          : ''
      );


      this.personalFormGroup.get("resultDate").setValue(new Date(this.vresultDate))
      this.personalFormGroup.get("procedureDate").setValue(this.vprocedureDate)
      this.personalFormGroup.get("consentDate").setValue(this.vconsentDate)
      this.personalFormGroup.get("processDate").setValue(this.vprocessDate)

      this.vpcpndtprocessId = this.registerObj.pcpndtProcessId

      this.getIndbyIdList()


      debugger
      // if (this.data?.opipType == 0) {
      //   setTimeout(() => {
      //     this._RadopPcpndService.getVisitById(this.data.opipid).subscribe((response) => {
      //       this.registerObj = response;
      //       this.Patientdetails = response;
      //       console.log(response)
      //     });
      //   }, 500);
      // } else {
      //   this._RadopPcpndService.getAdmissionById(this.data.opipid).subscribe((response) => {
      //     this.Patientdetails = response;
      //     console.log(response)


      //   });
      // }



    }
  }
  getIndList() {

    const param = {
      "searchFields": [],
      "mode": "PCPNDTIndicationList"
    }
    console.log(param)
    this._RadopPcpndService.getIndicationList(param).subscribe(res => {
      console.log(res)
      this.DSIndicationList.data = res
      this.DSIndicationList1.data = res

      this.DSIndicationList.data.forEach(element => {
        element.IsActive = false
      });


    });


  }
  activeIndications: any[] = [];
  getIndbyIdList() {

    const param = {
      "first": 0,
      "rows": 100,
      "sortField": "PcpndprocessDetId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "PCPNDTProcessId",
          "fieldValue": String(this.vpcpndtprocessId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
      ]
    }


    console.log(param)
    this._RadopPcpndService.getIndicationbyIdList(param).subscribe(res => {
      console.log(res.data)

      this.IndicationList.data = res.data

      if (this.DSIndicationList.data) {

        this.IndicationList.data.forEach((elementInd) => {
          if (elementInd.indicationValues === true ||
            elementInd.indicationValues === 'true' ||
            elementInd.indicationValues === 1) {

            this.activeIndications.push(elementInd);
          }
        });


        this.DSIndicationList1.data.forEach((element) => {

          element.IsActive = this.activeIndications.some(item =>
            item.indicationDesc?.trim().toLowerCase() === element.Value?.trim().toLowerCase()
          );
        });

        this.DSIndicationList.data = [...this.DSIndicationList1.data];
      }

      console.log(this.DSIndicationList.data)
    });

  }



  tableElementChecked(event: any, element: any) {

    const index = this.DSIndicationList1.data.findIndex(item => item === element);

    if (index !== -1) {
      this.DSIndicationList1.data[index].IsActive = true

    }
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      regId: [''],
      opIpType: [0],

    });
  }


  createFinalProcessForm() {

    return this.formBuilder.group({
      "pcpndtprocessId": this.vpcpndtprocessId,
      "processDate": [(new Date()).toISOString()],
      "opipid": this.OP_IP_Id,
      "opiptype": this.OP_IPType,
      "refDocId": [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "childrenCount": ["0"],
      "relativeName": this.PatientName,
      "mperiod": [''],

      "daughtersDetails": [''],
      "sonsDetails": [''],
      "consultantDocId": [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "resultDate": [(new Date()).toISOString()],

      "nonInvasive": [''],
      "indication": [''],
      "prenatal": [''],
      "ultrasound": false,
      "obs": false,
      "pelvic": false,
      "invasiveDoctorId": [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "complicationsId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "indicationofMtp": [''],
      "clinical": false,
      "bioChemical": false,
      "cytogenetic": false,
      "otherRadiological": false,
      "chromosomaldisorder": false,
      "metabolicdisorder": false,
      "congenitalanomaly": false,
      "mentalDisability": false,
      "haemoglobinopathy": false,
      "sexLinkeddisorder": false,
      "singlegenedisorder": false,
      "anyOther1": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "mage": false,
      "geneticDisease": false,
      "anyOtherIndication": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "chromosomal": false,
      "molecular": false,
      "preImplantation": false,
      "anyOtherTest": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      "amniocentesis": false,
      "chorionicVilliaspiration": false,
      "fetalBiopsy": false,
      "cordocentesis": false,
      "anyOther2": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

      "resultConveyedto": ['', Validators.required],
      "testResult": ['', Validators.required],
      "procedureDate": [(new Date()).toISOString()],//this.datePipe.transform(this.personalFormGroup.get("procedureDate").value, "yyyy-MM-dd"),

      "consentDate": [(new Date()).toISOString()],//this.datePipe.transform(this.personalFormGroup.get("consentDate").value, "yyyy-MM-dd"),
      "declarationDoctorid": [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

      "abhanumber": ['', [
        // Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.pattern('^[0-9]{14}$')   // Only 14 digits allowed
      ]],

      "address": [''],

      tPcpndprocessDetails: this.formBuilder.array([]),


    });
  }

  CreateIndicaionform(item: any): FormGroup {
    console.log(item)

    return this.formBuilder.group({
      "pcpndprocessDetId": 0,
      "pcpndtprocessId": this.vpcpndtprocessId,
      "indicationDesc": [item.Value || ''],
      "indicationValues": [item.IsActive || false]
    });
  }


  get IndicationsArray(): FormArray {
    return this.personalFormGroup.get('tPcpndprocessDetails') as FormArray;
  }


  onSave() {

    if (!this.personalFormGroup.invalid) {

      if (this.RegId == 0) {
        this.toastr.warning('Please select a Patient Name .', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning'
        });
        return;
      }


      console.log(this.DSIndicationList1.data)


      this.DSIndicationList1.data.forEach(item => {
        this.IndicationsArray.push(this.CreateIndicaionform(item));
      });

      this.personalFormGroup.get("opipid").setValue(parseInt(this.OP_IP_Id || 0))
      this.personalFormGroup.get("opiptype").setValue(parseInt(this.OP_IPType ))
      this.personalFormGroup.get("pcpndtprocessId").setValue(this.vpcpndtprocessId)
      this.personalFormGroup.get("abhanumber").setValue(String(this.personalFormGroup.get("abhanumber").value))

      this.personalFormGroup.get("refDocId").setValue(parseInt(this.personalFormGroup.get("refDocId").value || 0))
      this.personalFormGroup.get("consultantDocId").setValue(parseInt(this.personalFormGroup.get("consultantDocId").value || 0))
      this.personalFormGroup.get("invasiveDoctorId").setValue(parseInt(this.personalFormGroup.get("invasiveDoctorId").value || 0))
      this.personalFormGroup.get("declarationDoctorid").setValue(parseInt(this.personalFormGroup.get("declarationDoctorid").value || 0))
      this.personalFormGroup.get("complicationsId").setValue(parseInt(this.personalFormGroup.get("complicationsId").value || 0))
      this.personalFormGroup.get("anyOther1").setValue(parseInt(this.personalFormGroup.get("anyOther1").value || 0))
      this.personalFormGroup.get("anyOther2").setValue(parseInt(this.personalFormGroup.get("anyOther2").value || 0))
      this.personalFormGroup.get("anyOtherIndication").setValue(parseInt(this.personalFormGroup.get("anyOtherIndication").value || 0))

      this.personalFormGroup.get("resultDate").setValue(this.datePipe.transform(this.personalFormGroup.get("resultDate").value, "yyyy-MM-dd"))
      this.personalFormGroup.get("procedureDate").setValue(this.datePipe.transform(this.personalFormGroup.get("procedureDate").value, "yyyy-MM-dd"))
      this.personalFormGroup.get("consentDate").setValue(this.datePipe.transform(this.personalFormGroup.get("consentDate").value, "yyyy-MM-dd"))
      this.personalFormGroup.get("processDate").setValue(this.datePipe.transform(this.datePipe.transform(this.dateTimeObj.date), "yyyy-MM-dd"))


      console.log(this.personalFormGroup.value)

      this._RadopPcpndService.pcpndtSave(this.personalFormGroup.value).subscribe(response => {
        console.log(response)
        this.getPCPNDTview(response)
        this._matDialog.closeAll();

      });
    } else {
      const invalidFields = [];

      if (this.personalFormGroup.invalid) {
        for (const controlName in this.personalFormGroup.controls) {
          if (this.personalFormGroup.controls[controlName].invalid) {
            invalidFields.push(`PCPNDT Form: ${controlName}`);
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


  getPCPNDTview(PCPNDTProcessId) {
    setTimeout(() => {
      debugger
      const param = {
        "searchFields": [
          {
            "fieldName": "PCPNDTProcessId",
            "fieldValue": String(PCPNDTProcessId),
            "opType": "Equals"
          },

        ],
        "mode": "PcndtProcessForm"
      }


      console.log(param)
      this._RadopPcpndService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "PCPNDT Form  Viewer"

            }
          });

        matDialog.afterClosed().subscribe(result => {

        });
      });

    }, 100);

  }

  vSelectedOption: any = '1';
  onChangePatientType(event) {
    if (event.value == '0') {
      this.RegId = '';
      this.OP_IPType = 0

    } else if (event.value == '1') {
      this.RegId = '';
      this.OP_IPType = 1
    }
  }
  genderName = ""
  getSelectedObjOP(obj) {
    this.Patientobj = obj
    console.log(obj);
    this.Patientdetails = obj;
    this.OPDNoCheck = false;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.RegId = obj.regId;
    this.OP_IP_Id = obj.visitId;
    this.OPDNo = obj.opdNo;
    this.HospitalId = obj.hospitalId;
    this.DoctorName = obj.doctorName;
    this.RegNo = obj?.regNo;
    this.genderName = obj?.genderName;

    if (this.genderName == 'Male') {
      Swal.fire('Select Female Patient Only.............');
      return;
    }
  }

  getSelectedObjRegIP(obj) {
    console.log(obj);

    // this.Patientobj = obj
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
      this.Patientdetails = obj;
      this.DoctorNamecheck = true;
      this.IPDNocheck = false;
      this.OPDNoCheck = false;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = obj.regID;
      this.OP_IP_Id = obj.admissionID;
      this.IPDNo = obj.ipdNo;
      this.DoctorName = obj.doctorName;
      this.tariffName = obj.tariffName;
      this.roomName = obj.roomName;
      this.bedName = obj.bedName;
      this.RegNo = obj?.regNo;
      this.departmentName = obj?.departmentName;
      this.genderName = obj?.genderName;
    }

    if (this.genderName == 'Male') {
      Swal.fire('Selected Female Patient Only.............');
      return;
    }
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      RegId: [],
      ClinicName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      ClinicAddress: [
        { name: "pattern", Message: "only char allowed." }
      ],
      RelativeName: [
        { name: "required", Message: "Last Name is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      NoOfDaughters: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      RegistrationNo: [
        { name: "required", Message: "RegistrationNo is required" }
      ],
      PatientAddress: [
        { name: "required", Message: "PatientAddress is required" }
      ],
      PatientName: [
        { name: "required", Message: "City Name is required" }
      ],
      PatientContactNo: [
        { name: "required", Message: "PatientContactNo is required" }
      ],
      refDocId: [
        { name: "required", Message: "refDocId is required" }
      ],

      Sons: [
        { name: "required", Message: "Sons is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      DoctorID: [
        { Message: "DoctorID is required" }
      ],
      Noninvasive: [
        { name: "required", Message: "Noninvasive is required" }
      ],
      Indication: [
        { name: "required", Message: "Indication is required" }
      ],
      Prenatal: [
        { name: "required", Message: "Prenatal is required" }
      ],
      ConsultantDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      Complications: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      Doctor2: [
        { name: "required", Message: "Doctor2 is required" }
      ],

      cityId: [
        { name: "required", Message: "cityId is required" }
      ],
      doctorId: [
        { name: "required", Message: "doctorId is required" }
      ],
      anyOther2: [],
      complicationsId: [],
      invasiveDoctorId: [],
      consultantDocId: [],
    };
  }

onClose() {

    this._matDialog.closeAll()
  }



  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}



export class Indicationdetail {
  descName: any;
  descvalue: any;
  IsActive: any;
  Value: any;
  indicationValues: any
  indicationDesc: any
  constructor(Indicationdetail) {
    this.descName = Indicationdetail.descName || '';
    this.descvalue = Indicationdetail.descvalue || false;
    this.IsActive = Indicationdetail.IsActive || false;
    this.Value = Indicationdetail.Value || '';
    this.indicationDesc = Indicationdetail.indicationDesc || '';
    this.indicationValues = Indicationdetail.indicationValues || false;

  }
}
