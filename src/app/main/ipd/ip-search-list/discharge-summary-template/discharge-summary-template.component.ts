import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrescriptionTemplateComponent } from 'app/main/opd/new-casepaper/prescription-template/prescription-template.component';
import { DosemasterComponent } from 'app/main/setup/prescription/dosemaster/dosemaster.component';
import { NewDoseMasterComponent } from 'app/main/setup/prescription/dosemaster/new-dose-master/new-dose-master.component';
import { PrescriptionTemplateComponent as SetupPrescriptionTemplateMaster } from 'app/main/setup/prescription/prescription-template/prescription-template.component';

@Component({
  selector: 'app-discharge-summary-template',
  templateUrl: './discharge-summary-template.component.html',
  styleUrls: ['./discharge-summary-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeSummaryTemplateComponent {


  DischargesumForm: FormGroup;
  MedicineItemForm: FormGroup;
  vAdmissionId: any = 0;
  vDischargeId: any = 0;
  IsNormalDeath: any = 1;
  doseId = 0;
  doseName1 = "";
  vIsNormalDeath = '1';
  TemplateId = 0;
  autocompleteModetemplate: string = "DischargeTemplate";
  DischargeSummaryId: any = 0;
  // Chargeslist: any = [];
  registerObj = new DischargeSummary({});
  RetrDischargeSumryList: any = [];
  registerObj1 = new AdmissionPersonlModel({});
  screenFromString = 'discharge-summary';
  dateTimeObj: any;
  ItemName: any;
  ItemId: any;
  vDay: any;
  vInstruction: any;
  displayedColumns: string[] = [
    'itemName',
    'doseName',
    'day',
    //  'Remark',
    'Action'
  ]
  saveflag: boolean = false
  isItemIdSelected: boolean = false;
  vTemplateDesc = '';
  Tempdesc: any;
  @ViewChild('itemid') itemid: ElementRef;
  vstoreId = this.accountService.currentUserValue.user.storeId

  autocompleteModeDose: string = "DoseMaster";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteitem: string = "Item";
  autocompletetemplate: string = "DischargeTemplate";
  autocompleteModeTemplate: string = "PrescriptionTemplateMaster";

  dsItemList = new MatTableDataSource<MedicineItemList>();

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargeSummaryTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.DischargesumForm = this.showDischargeSummaryForm();
    this.DischargesumForm.markAllAsTouched();

    this.MedicineItemForm = this.MedicineItemform();
    this.DischargesumForm.markAllAsTouched();

    this.prescriptionTemplateArray.push(this.createprescriptionTemplate());

    console.log(this.data)
    if (this.data) {
      this.registerObj = this.data;
      this.vAdmissionId = this.data.admissionId;
      this.DischargesumForm.get("discharge.admissionId")?.setValue(this.data.admissionId)
      this.getDischargeSummaryData(this.vAdmissionId)
      this.getPrescription(this.vAdmissionId)
    }

    if ((this.data?.regId ?? 0) > 0) {

      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
        });
        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(this.registerObj1)
          if (this.registerObj1) {
            this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
          }
        });
      }, 500);
    }
  }

  MedicineItemform(): FormGroup {
    return this._formBuilder.group({
      ItemId: '',
      DoseId: '',
      Day: '',
      Instruction: '',
      TemplateId: ['']
    });
  }

  showDischargeSummaryForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isNormalOrDeath: 1,
      discharge: this._formBuilder.group({
        dischargeSummaryId: [this.DischargeSummaryId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        admissionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],// this.vAdmissionId,
        dischargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        dischargeDoctor1: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        dischargeDoctor2: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        dischargeDoctor3: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        followupdate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        isNormalOrDeath: '1',
        templateDescriptionHtml: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
        addedBy: [0, this._FormvalidationserviceService.onlyNumberValidator()],
        updatedBy: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      }),
      prescriptionTemplate: this._formBuilder.array([]),
    });
  }

  // 2. FormArray Group for Refund Detail
  createprescriptionTemplate(item: any = {}): FormGroup {
    return this._formBuilder.group({
      opdIpdId: [this.vAdmissionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      pTime: [this.datePipe.transform(new Date(), 'shortTime')],
      classId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      genericId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugId: [item.itemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doseId: [Number(item.doseId) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [Number(item.days) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instructionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instruction: [''],
      remark: [''],
      isEnglishOrIsMarathi: true,
      storeId: this.accountService.currentUserValue.user.storeId,
      createdBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  get prescriptionTemplateArray(): FormArray {
    return this.DischargesumForm.get('prescriptionTemplate') as FormArray;
  }

  // OnSave() {

  //    this.DischargesumForm.get('templateDescriptionHtml')?.valueChanges.subscribe(val => {
  //   console.log('Editor output:', val);
  // });



  //   if (!this.DischargesumForm.invalid) {
  //     Swal.fire({
  //       title: 'Do you want to Save the Discharge Summary Template',
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, Save!"

  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.saveflag = true
  //         if (this.DischargesumForm.get("isNormalOrDeath").value == false)
  //           this.vIsNormalDeath = "0"
  //         if (this.DischargesumForm.get("isNormalOrDeath").value == true)
  //           this.vIsNormalDeath = "1"

  //         this.DischargesumForm.get("discharge.isNormalOrDeath")?.setValue(Number(this.vIsNormalDeath))
  //         this.DischargesumForm.get("discharge.dischargeSummaryId")?.setValue(this.DischargeSummaryId);

  //         debugger
  //         this.prescriptionTemplateArray.clear();
  //         this.dsItemList.data.forEach(item => {
  //           this.prescriptionTemplateArray.push(this.createprescriptionTemplate(item));
  //         });

  //         // update
  //         if (this.DischargesumForm.get('discharge.dischargeSummaryId')?.value) {

  //           this.DischargesumForm.get('discharge.updatedBy').setValue(this.accountService.currentUserValue.userId)

  //           let updateData = {
  //             "discharge": this.DischargesumForm.value.discharge,
  //             "prescriptionTemplate": this.DischargesumForm.value.prescriptionTemplate
  //           };
  //           console.log(updateData)

  //           this._IpSearchListService.UpdateIPDDischargSummaryTemplate(updateData).subscribe(response => {
  //             this.viewgetDischargesummaryPdf(this.vAdmissionId)
  //             this._matDialog.closeAll();
  //           });

  //         } else {       //insert     
  //           this.DischargesumForm.get('discharge.addedBy').setValue(this.accountService.currentUserValue.userId)

  //           let insertData = {
  //             "discharge": this.DischargesumForm.value.discharge,
  //             "prescriptionTemplate": this.DischargesumForm.value.prescriptionTemplate
  //           };
  //           console.log(insertData)

  //           this._IpSearchListService.insertIPDDischargSummaryTemplate(insertData).subscribe(response => {
  //             this.getPrint(response)
  //             this._matDialog.closeAll();
  //           });
  //         }
  //       }
  //     })
  //   } else {
  //     let invalidFields = [];

  //     if (this.DischargesumForm.invalid) {
  //       for (const controlName in this.DischargesumForm.controls) {
  //         if (this.DischargesumForm.controls[controlName].invalid) {
  //           invalidFields.push(`Discharge Form: ${controlName}`);
  //         }
  //       }
  //     }
  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
  //         );
  //       });
  //     }
  //   }
  // }


  OnSave() {

    if (this.DischargesumForm.get("discharge.templateDescriptionHtml")?.value == '' || this.DischargesumForm.get("discharge.templateDescriptionHtml")?.value == undefined) {
      this.toastr.warning('Please Enter Template', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.DischargesumForm.get("discharge.dischargeDoctor1")?.value == '' || this.DischargesumForm.get("discharge.dischargeDoctor1")?.value == undefined) {
      this.toastr.warning('Please Select Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.DischargesumForm.get('templateDescriptionHtml')?.valueChanges.subscribe(val => {
      console.log('Editor output:', val);
    });



    if (!this.DischargesumForm.invalid) {
      Swal.fire({
        title: 'Do you want to Save the Discharge Summary Template',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save!"

      }).then((result) => {
        if (result.isConfirmed) {
          this.saveflag = true
          if (this.DischargesumForm.get("isNormalOrDeath").value == false)
            this.vIsNormalDeath = "0"
          if (this.DischargesumForm.get("isNormalOrDeath").value == true)
            this.vIsNormalDeath = "1"

          this.DischargesumForm.get("discharge.isNormalOrDeath")?.setValue(Number(this.vIsNormalDeath))
          this.DischargesumForm.get("discharge.dischargeSummaryId")?.setValue(this.DischargeSummaryId);

          // debugger
          this.prescriptionTemplateArray.clear();
          this.dsItemList.data.forEach(item => {
            this.prescriptionTemplateArray.push(this.createprescriptionTemplate(item));
          });

          // const form=this.DischargesumForm
          // form.TemplateId.re

          // this.DischargesumForm.removeControl('TemplateId')
          this.DischargesumForm.removeControl('isNormalOrDeath')

          if (this.DischargesumForm.get('discharge.dischargeSummaryId')?.value)
            this.DischargesumForm.get('discharge.updatedBy').setValue(this.accountService.currentUserValue.userId)
          else

            this.DischargesumForm.get('discharge.addedBy').setValue(this.accountService.currentUserValue.userId)

          let insertData = {
            "discharge": this.DischargesumForm.value.discharge,
            "prescriptionTemplate": this.DischargesumForm.value.prescriptionTemplate
          };
          console.log(insertData)
          console.log(this.DischargesumForm.value)

          // debugger
          this._IpSearchListService.insertIPDDischargSummaryTemplate(this.DischargesumForm.value).subscribe(response => {
            console.log(response)
            if (response)
              this.getPrint(this.vAdmissionId)
            this._matDialog.closeAll();
          });
        }

      })
    }
    //  else {
    //   let invalidFields = [];

    //   if (this.DischargesumForm.invalid) {
    //     for (const controlName in this.DischargesumForm.controls) {
    //       if (this.DischargesumForm.controls[controlName].invalid) {
    //         invalidFields.push(`Discharge Summary Form: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //   }
    // }
  }


  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getdose(event) {
    this.doseName1 = event.text
    this.doseId = event.value
  }

  getSelectedserviceObj(obj) {
    this.ItemId = obj.itemId
    this.ItemName = obj.itemName
    this.doseId = Number(obj.doseName)
    this.vDay = obj.doseDay
    console.log(obj)

    if (this.doseId > 0) {
      this._IpSearchListService.getDoseMasterById(this.doseId).subscribe((response) => {
        this.doseName1 = response.doseName;
      });
      const doseRow = {
        value: this.doseId,
        text: this.doseName1
      };
      this.getdose(doseRow);
    }
  }
  ItemFromReset() {
    const form = this.MedicineItemForm;
    form.patchValue({
      ItemId: "",
      DoseId: "",
      vDay: "",
      Day: "",
    });
  }

  showTemplateRefresh = true;
  templateId: any;
  templateName: any;
  Chargelist: any[] = [];

  SaveTemplate() {
    if (this.dsItemList.data.length == 0) {
      Swal.fire('Error !', 'Please add prescription in table', 'error');
      return
    }
    const dialogRef = this._matDialog.open(PrescriptionTemplateComponent,
      {
        maxWidth: "50vw",
        maxHeight: "35vh",
        width: '100%',
        // height: "100%",
        data: {
          Obj: this.dsItemList.data,
          opiptype: 1,
          category: 'DischargeSummeryTemplate'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.showTemplateRefresh = false;
      setTimeout(() => {
        this.showTemplateRefresh = true;
      }, 100);
    });
  }

  TemplateList() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur();
    const dialogRef = this._matDialog.open(SetupPrescriptionTemplateMaster,
      {
        maxWidth: "100vw",
        maxHeight: '90%',
        width: '90%',
      });
    dialogRef.componentInstance.openedFromIPD = true;
    dialogRef.afterClosed().subscribe(result => {
      this.showTemplateRefresh = false;
      setTimeout(() => {
        this.showTemplateRefresh = true;
      }, 100);
    });
  }
  selectChangeTemplateName(row) {
    this.templateId = row.presId
    this.templateName = row.presTemplateName
  }

  FetchList: any = [];
  onTemplDetAdd() {
    if (!this.MedicineItemForm.get("TemplateId")?.value) {
      this.toastr.warning('Please select a Template Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const iscekDuplicate = 0
    //  this.dsItemList.data.some(item => item.Presid == this.MedicineItemForm.get('TemplateId').value)
    if (!iscekDuplicate) {
      var vdata = {
        "first": 0,
        "rows": 10,
        "sortField": "Presid",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "Presid",
            "fieldValue": String(this.templateId),//"40773",	
            "opType": "Equals"
          }
        ],
        "Columns": [],
        "exportType": "JSON"
      }

      this._IpSearchListService.getTempPrescriptionList(vdata).subscribe(data => {
        // this.dsItemList.data = data.data as MedicineItemList[];
        this.Chargelist = data.data as MedicineItemList[];

        this.Chargelist = data.data.map(x => ({
          itemID: x.itemID ?? x.drugId,
          itemName: x.itemName ?? x.drugName,
          ...x
        }));

        // add FetchList items
        this.FetchList.forEach(element => {
          this.Chargelist.push({
            itemID: element.drugId,
            itemName: element.drugName
          });
        });
        this.dsItemList.data = this.Chargelist;
        console.log('Template data:', this.dsItemList.data)
      });
    }
    else {
      this.toastr.warning('Selected Template Details already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.MedicineItemForm.get('TemplateId').reset('');
  }

  onAdd() {
    if ((this.MedicineItemForm.get("ItemId").value == "" || this.MedicineItemForm.get("DoseId").value == "")) {
      this.toastr.warning('Please select Item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("DoseId")?.value) {
      this.toastr.warning('Please select a Dose Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    //  if ((this.vDay == '' || this.vDay == null || this.vDay == undefined)) {
    //   this.toastr.warning('Please enter a Day', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    if (!Array.isArray(this.Chargelist)) {
      console.warn("Chargelist was not an array. Resetting...");
      this.Chargelist = [...this.dsItemList.data];
    }

    const iscekDuplicate = this.dsItemList.data.some(item => item.itemID == this.ItemId)
    if (!iscekDuplicate) {
      // this.dsItemList.data = [];
      let newEntry = {
        itemID: this.MedicineItemForm.get('ItemId').value.itemId || 0,
        itemName: this.MedicineItemForm.get('ItemId').value.itemName || '',
        doseName: this.doseName1,//this.MedicineItemForm.get('DoseId').value || '',
        doseId: this.doseId,// this.MedicineItemForm.get('DoseId').value || 0,
        days: this.MedicineItemForm.get('Day').value || 0,
        instruction: this.vInstruction || ''
      }
      this.Chargelist.push(newEntry);
      this.dsItemList.data = [...this.Chargelist];
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.MedicineItemForm.get('ItemId').reset('%');
    this.MedicineItemForm.get('DoseId').reset('');
    this.MedicineItemForm.get('Day').reset('');
    this.MedicineItemForm.get('Instruction').reset('');
    // this.itemid.nativeElement.focus();
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  getPrescription(AdmissionId) {
    console.log(AdmissionId)
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(AdmissionId),//"40773",	
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    console.log(m_data2)
    this._IpSearchListService.getPrescriptionList(m_data2).subscribe((data) => {
      // this.dsItemList.data = data?.data as MedicineItemList[];
      // if (this.dsItemList.data)
      this.Chargelist = data.data as MedicineItemList[];
      this.dsItemList.data = [...this.Chargelist];
      // console.log(this.dsItemList.data);
    });
  }

  getDischargeSummaryData(AdmissionId) {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(AdmissionId),// "40622",	
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }

    console.log(m_data2)
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {

      this.RetrDischargeSumryList = data?.data as DischargeSummary;
      console.log(this.RetrDischargeSumryList);
      if (this.RetrDischargeSumryList.length != 0) {

        this.DischargeSummaryId = this.RetrDischargeSumryList[0].dischargeSummaryId || 0
        this.vIsNormalDeath = this.RetrDischargeSumryList[0].isNormalOrDeath
        this.vTemplateDesc = this.RetrDischargeSumryList[0].templateDescriptionHtml
        console.log(this.RetrDischargeSumryList[0].templateDescriptionHtml)
        // debugger
        //  this.isItemIdSelected = false
        if (this.RetrDischargeSumryList[0].templateDescriptionHtml !== "")
          this.DischargesumForm.get('TemplateId').disable();
        console.log(this.vTemplateDesc);
        this.DischargesumForm.get("discharge.dischargeDoctor1").setValue(Number(this.RetrDischargeSumryList[0].dischargeDoctor1))
        this.DischargesumForm.get("discharge.dischargeDoctor2").setValue(Number(this.RetrDischargeSumryList[0].dischargeDoctor2))
        this.DischargesumForm.get("discharge.dischargeDoctor3").setValue(this.RetrDischargeSumryList[0].dischargeDoctor3)

        if (this.RetrDischargeSumryList[0].isNormalOrDeath == 0)
          this.vIsNormalDeath = '0'
        else
          this.vIsNormalDeath = '1'
      }
    });

  }

  showDoseDropdownRefresh = true;
  getDosemaster() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    const dialogRef = this._matDialog.open(NewDoseMasterComponent,
      {
        maxWidth: "50vw",
        maxHeight: '50%',
        width: '70%',
      });
    // dialogRef.componentInstance.openedFromOPD = true;
    dialogRef.afterClosed().subscribe(result => {
      this.showDoseDropdownRefresh = false;
      setTimeout(() => {
        this.showDoseDropdownRefresh = true;
      }, 100);
    });
  }

  getPrint(contact) {
    Swal.fire({
      title: 'Select Report Format',
      text: "Choose how you want to view the report:",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "With Header",
      denyButtonText: "Without Header Template",
    }).then((result) => {
      debugger
      if (result.isConfirmed) {
        this.viewgetDischargesummaryPdf(contact);
      } else if (result.isDenied) {
        this.viewgetDischargesummaryTempPdf(contact);
      }
    });
  }

  viewgetDischargesummaryPdf(AdmId) {
    console.log(AdmId)
    this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryTemplatewithPatientHeader");
    // this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryTemplate");
  }

  viewgetDischargesummaryTempPdf(AdmId) {
    console.log(AdmId)
    this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryTemplatepatientWithoutHeader");
    // this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryTemplateWithoutHeader");
  }

  getValidationMessages() {
    return {
      RegId: [],
      dischargeDoctor1: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      dischargeDoctor2: [
        // { name: "required", Message: "Middle Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      dischargeDoctor3: [
        { name: "required", Message: "Last Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      areaId: [
        { name: "required", Message: "Area Name is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      religionId: [
        { name: "required", Message: "Religion Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],
      maritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phoneNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      aadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AadharCard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }
      ],
      MaritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],
      tariffId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      PurposeId: [
        { name: "required", Message: "Purpose Name is required" }
      ],
      CompanyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      SubCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      bedId: [
        { name: "required", Message: "bedId Name is required" }
      ],
      wardId: [
        { name: "required", Message: "wardId Name is required" }
      ],
      DoseId: []

    };
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onChangetemp(e) {
    console.log(e)
    this.Tempdesc = e.templateDescription
    if (e.templateId > 0)
      this.isItemIdSelected = true
  }

  onAddTemplate(e) {
    this.vTemplateDesc = this.Tempdesc
    // this.DischargesumForm.get('templateDescriptionHtml').setValue(this.Tempdesc)

  }

  onClose() {
    this.DischargesumForm.reset();
    this._matDialog.closeAll();
  }
}

export class DischargeSummary {
  AdmissionId: any;
  DischargeId: any;
  dischargeId: any;
  History: any;
  Diagnosis: any;
  Investigation: any;
  ClinicalFinding: any;
  OpertiveNotes: any;
  TreatmentGiven: any;
  TreatmentAdvisedAfterDischarge: any;
  Followupdate: any;
  Remark: any;
  DischargeSummaryDate: any;
  OPDate: any;
  OPTime: any;
  DischargeDoctor1: any;
  DischargeDoctor2: any;
  DischargeDoctor3: any;
  DischargeSummaryTime: any;
  DoctorAssistantName: any;
  ClaimNumber: any;
  PreOthNumber: any;
  AddedBy: any;
  AddedByDate: any;
  UpdatedBy: any;
  UpdatedByDate: any;
  SurgeryProcDone: any;
  ICD10CODE: any;
  ClinicalConditionOnAdmisssion: any;
  OtherConDrOpinions: any;
  ConditionAtTheTimeOfDischarge: any;
  PainManagementTechnique: any;
  LifeStyle: any;
  WarningSymptoms: any;
  Radiology: any;
  IsNormalOrDeath: any;
  DischargesummaryId: any;
  Pathology: any;
  DocNameID: any;
  TemplateDescriptionHtml: any;
  IsDischarged: any;
  templateDescriptionHtml: any;


  constructor(DischargeSummary) {
    this.DischargesummaryId = DischargeSummary.DischargesummaryId || 0,
      this.AdmissionId = DischargeSummary.AdmissionId || 0,
      this.DischargeId = DischargeSummary.DischargeId || 0,
      this.dischargeId = DischargeSummary.dischargeId || 0,
      this.History = DischargeSummary.History || 0,
      this.Diagnosis = DischargeSummary.Diagnosis || 0,
      this.Investigation = DischargeSummary.Investigation || 0,
      this.ClinicalFinding = DischargeSummary.ClinicalFinding || 0,
      this.OpertiveNotes = DischargeSummary.OpertiveNotes || 0,
      this.TreatmentGiven = DischargeSummary.TreatmentGiven || 0,
      this.TreatmentAdvisedAfterDischarge = DischargeSummary.TreatmentAdvisedAfterDischarge || 0,
      this.Followupdate = DischargeSummary.Followupdate || new Date(),
      this.Remark = DischargeSummary.Remark || 0,
      this.DischargeSummaryDate = DischargeSummary.DischargeSummaryDate || 0,
      this.OPDate = DischargeSummary.OPDate || 0,
      this.OPTime = DischargeSummary.OPTime || 0,
      this.DischargeDoctor1 = DischargeSummary.DischargeDoctor1 || 0,
      this.DischargeDoctor2 = DischargeSummary.DischargeDoctor2 || 0,
      this.DischargeDoctor3 = DischargeSummary.DischargeDoctor3 || 0,
      this.DischargeSummaryTime = DischargeSummary.DischargeSummaryTime || 0,
      this.DoctorAssistantName = DischargeSummary.DoctorAssistantName || 0
    this.Pathology = DischargeSummary.Pathology || '';
    this.TemplateDescriptionHtml = DischargeSummary.TemplateDescriptionHtml || '';
    this.templateDescriptionHtml = DischargeSummary.templateDescriptionHtml || '';
    this.IsDischarged = DischargeSummary.IsDischarged || 0;
  }
}
export class MedicineItemList {
  itemID: any;
  ItemID: any;
  itemId: any;
  itemName: string;
  doseName: any;
  days: number;
  doseName1: any;
  day1: number;
  DoseName2: any;
  Day2: number;
  Instruction: any;
  doseId: any;
  DoseId1: any;
  DoseId2: any;
  Day: any;
  DaysOption2: any;
  DaysOption3: any;
  DoseNameOption2: any;
  DoseNameOption3: any;
  /**
  * Constructor
  *
  * @param MedicineItemList
  */
  constructor(MedicineItemList) {
    {
      this.itemId = MedicineItemList.itemId || 0;
      this.ItemID = MedicineItemList.ItemID || 0;
      this.itemID = MedicineItemList.itemID || 0;
      this.itemName = MedicineItemList.itemName || "";

      this.Instruction = MedicineItemList.Instruction || '';
      this.doseName = MedicineItemList.doseName || '';
      this.days = MedicineItemList.days || 0;
      this.doseId = MedicineItemList.doseId || 0;
      this.doseName1 = MedicineItemList.doseName1 || '';
      this.day1 = MedicineItemList.day1 || 0;
      this.DoseName2 = MedicineItemList.DoseName2 || '';
      this.Day2 = MedicineItemList.Day2 || 0;
      this.DoseId1 = MedicineItemList.DoseId1 || '';
      this.DoseId2 = MedicineItemList.DoseId2 || 0;
      this.DaysOption2 = MedicineItemList.DaysOption2 || 0;
      this.DaysOption3 = MedicineItemList.DaysOption3 || 0;
      this.DoseNameOption2 = MedicineItemList.DoseNameOption2 || '';
      this.DoseNameOption3 = MedicineItemList.DoseNameOption3 || '';
    }
  }
}
