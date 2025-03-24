import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { M } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-discharge-summary-template',
  templateUrl: './discharge-summary-template.component.html',
  styleUrls: ['./discharge-summary-template.component.scss']
})
export class DischargeSummaryTemplateComponent {
  
  
   editorConfig: AngularEditorConfig = {
          editable: true,
          spellcheck: true,
          height: '24rem',
          minHeight: '24rem',
          translate: 'yes',
          placeholder: 'Enter text here...',
          enableToolbar: true,
          showToolbar: true,
        };
      
        onBlur(e: any) {
          this.vTemplateDesc = e.target.innerHTML;
          throw new Error('Method not implemented.');
        }
    DischargesumForm: FormGroup;
    MedicineItemForm: FormGroup;
    submitted = false;
    msg: any;
    Id: any;
    a: any;
        
    vTreatmentGiven: any;
    vAdmissionId: any = 0;
    vDischargeId: any = 0;
    IsNormalDeath: any = 1;
    doseId = 0
    doseName1 = ""
    DocName3 = 0
    IsDeath: any;
    vIsNormalDeath = 1;
    bp: any = 1000;
    TemplateId=0;
    autocompleteModetemplate: string = "DischargeTemplate";
    DischargeSummaryId: any;
    TemplateList: any = [];
    Chargeslist: any = [];
    DischargeSList = new DischargeSummary({});
    selectedAdvanceObj: AdvanceDetailObj;
    registerObj = new DischargeSummary({});
    menuActions: Array<string> = [];
    RetrDischargeSumryList: any = [];
    lngAdmId: any = [];
    registerObj1 = new AdmissionPersonlModel({});
    screenFromString = 'discharge-summary';
    dateTimeObj: any;
  
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
  
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() dataArray: any;
   
    @ViewChild('itemid') itemid: ElementRef;
  
    autocompleteModeDose: string = "DoseMaster";
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeDoctor: string = "ConDoctor";
    autocompleteitem: string = "Item";
    autocompletetemplate: string = "DischargeTemplate";
    
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
      public datePipe: DatePipe) { }
  
  
    ngOnInit(): void {
      this.DischargesumForm = this.showDischargeSummaryForm();
      this.MedicineItemForm = this.MedicineItemform();
  
      console.log(this.data)
      if (this.data) {
  
        this.registerObj = this.data;
        this.vAdmissionId = this.data.admissionId;
  
        this.getDischargeSummaryData( this.vAdmissionId)
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
            if (this.registerObj1) {
              this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
              this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
              this.registerObj1.admissionTime = this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
              this.registerObj1.dischargeTime = this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')
            }
            console.log(this.registerObj1)
  
          });
  
  
        }, 500);
      }
  
      this.getdischargeIdbyadmission();
  }
  
  saveflag: boolean = false
    isItemIdSelected: boolean = false;
    MedicineItemform(): FormGroup {
      return this._formBuilder.group({
        ItemId: '',
        DoseId: '',
        Day: '',
        Instruction: '',
      });
    }
    vTemplateDesc='';
    Tempdesc:any;
    showDischargeSummaryForm(): FormGroup {
      return this._formBuilder.group({
        TemplateId:0,
        templateDesc:'',
        dischargeSummaryId: 0,
        admissionId: '',
        dischargeId: '',
       
        dischargeDoctor1: 0,
        dischargeDoctor2: 0,
        dischargeDoctor3: 0,
        dischargeSummaryTime: "11:00:00 PM",
        doctorAssistantName: "",
      
        isNormalOrDeath:  ['1']
      });
    }
  
    getdose(event) {
      this.doseName1 = event.text
      this.doseId = event.value
    }
    getSelectedserviceObj(obj) {
      this.ItemId=obj.serviceId
     console.log(obj)
  
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
  
  
  
    onAdd() {
  
      if ((this.MedicineItemForm.get("ItemId").value=="" || this.MedicineItemForm.get("DoseId").value =="")) {
        this.toastr.warning('Please select Item', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

      const iscekDuplicate = this.dsItemList.data.some(item => item.itemID == this.ItemId)
      if (!iscekDuplicate) {
        this.dsItemList.data = [];
        this.Chargeslist.push(
          {
            itemID: this.MedicineItemForm.get('ItemId').value.serviceId || 0,
            itemName: this.MedicineItemForm.get('ItemId').value.serviceName || '',
            doseName: this.doseName1,//this.MedicineItemForm.get('DoseId').value || '',
            doseId: this.doseId,// this.MedicineItemForm.get('DoseId').value || 0,
            days: this.MedicineItemForm.get('Day').value || 0,
            instruction: this.vInstruction || ''
          });
        this.dsItemList.data = this.Chargeslist
      } else {
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.MedicineItemForm.get('ItemId').reset('');
      this.MedicineItemForm.get('DoseId').reset('');
      this.MedicineItemForm.get('Day').reset('');
      this.MedicineItemForm.get('Instruction').reset('');
      // this.itemid.nativeElement.focus();
    }
  
    deleteTableRow(event, element) {
          let index = this.Chargeslist.indexOf(element);
      if (index >= 0) {
        this.Chargeslist.splice(index, 1);
        this.dsItemList.data = [];
        this.dsItemList.data = this.Chargeslist;
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
        "exportType": "JSON"
      }
      console.log(m_data2)
      this._IpSearchListService.getPrescriptionList(m_data2).subscribe((data) => {
        this.dsItemList.data = data?.data as MedicineItemList[];
        if (this.dsItemList.data)
          this.Chargeslist = data.data as MedicineItemList[];
        console.log(this.dsItemList.data);
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
        "exportType": "JSON"
      }
  
      console.log(m_data2)
      this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data) => {
        console.log(data);
       
        this.RetrDischargeSumryList = data?.data as DischargeSummary;
        console.log(this.RetrDischargeSumryList);
        if (this.RetrDischargeSumryList.length != 0) {
          this.DischargeSummaryId = this.RetrDischargeSumryList[0].dischargeSummaryId || 0
          this.vIsNormalDeath = this.RetrDischargeSumryList[0].isNormalOrDeath
          this.vTemplateDesc =this.RetrDischargeSumryList[0].templateDescriptionHtml
          console.log(this.vTemplateDesc);
          this.DischargesumForm.get("dischargeDoctor1").setValue(this.RetrDischargeSumryList[0].dischargeDoctor1)
          this.DischargesumForm.get("dischargeDoctor2").setValue(this.RetrDischargeSumryList[0].dischargeDoctor2)
          this.DischargesumForm.get("dischargeDoctor3").setValue(this.RetrDischargeSumryList[0].dischargeDoctor3)
  }
       });
      //  this.getTemplateList() 

    }

    getTemplateList() {
      if (this.data) {
        this._IpSearchListService.gettemplateId(this.TemplateId).subscribe(data => {
          console.log(data)
          this.DischargesumForm.get('TemplateId').setValue(data.templateId);
        this.vTemplateDesc = data.templateDescription
        });

      }
  }

    getdischargeIdbyadmission() {
      
      this._IpSearchListService.getDischargeId(this.data.admissionId).subscribe(data => {
        console.log(data)
        
        if (data.dischargeId)
          this.vDischargeId = data.dischargeId
        else this.vDischargeId = 0
      });
    }
  
    OnSave() {
      Swal.fire({
        title: 'Do you want to Save the Discharge Summary Template',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save!"
  
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.saveflag = true
          if(this.DischargesumForm.get("isNormalOrDeath").value==false)
            this.vIsNormalDeath=0
          if(this.DischargesumForm.get("isNormalOrDeath").value==true)
            this.vIsNormalDeath=1
  
          let dischargModeldata = {};
  
            dischargModeldata['dischargesummaryId'] = this.DischargeSummaryId || 0,
            dischargModeldata['admissionId'] = this.vAdmissionId || 0,
            dischargModeldata['dischargeId'] = this.vDischargeId,
            dischargModeldata['followupdate'] = (this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')),
            dischargModeldata['dischargeDoctor1'] = this.DischargesumForm.get("dischargeDoctor1").value,
            dischargModeldata['dischargeDoctor2'] = this.DischargesumForm.get("dischargeDoctor2").value,
            dischargModeldata['dischargeDoctor3'] = this.DischargesumForm.get("dischargeDoctor3").value,
            dischargModeldata['isNormalOrDeath'] =this.vIsNormalDeath// this.DischargesumForm.get("isNormalOrDeath").value
            dischargModeldata['templateDescriptionHtml'] = this.DischargesumForm.get("templateDesc").value || ''
           
  
          let insertIPPrescriptionDischarge = [];
          this.dsItemList.data.forEach(element => {
            let Prescdiscgargemodel = {};
            Prescdiscgargemodel['opdIpdId'] = this.vAdmissionId || 0;
            Prescdiscgargemodel['opdIpdType'] = 1;
            Prescdiscgargemodel['date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd');
            Prescdiscgargemodel['pTime'] = this.dateTimeObj.time;
            Prescdiscgargemodel['classId'] = 0;
            Prescdiscgargemodel['genericId'] = 0;
            Prescdiscgargemodel['drugId'] = element.itemID || 0;
            Prescdiscgargemodel['doseId'] = element.doseId || 0;
            Prescdiscgargemodel['days'] = element.days || 0;
            Prescdiscgargemodel['instructionId'] = 0;
            Prescdiscgargemodel['qtyPerDay'] = 0;
            Prescdiscgargemodel['totalQty'] = 0;
            Prescdiscgargemodel['instruction'] = "";
            Prescdiscgargemodel['remark'] = "";
            Prescdiscgargemodel['isEnglishOrIsMarathi'] = true;
            Prescdiscgargemodel['storeId'] =1,// this.accountService.currentUserValue.user.storeId || 0;
            Prescdiscgargemodel['createdBy'] = this.accountService.currentUserValue.userId,
            insertIPPrescriptionDischarge.push(Prescdiscgargemodel);
          });
  
          if (this.DischargeSummaryId == undefined) {
           
              dischargModeldata['addedBy'] =this.accountService.currentUserValue.userId
  
            var data = {
              "discharge": dischargModeldata,
              "prescriptionTemplate": insertIPPrescriptionDischarge
            }
            console.log(data);
            setTimeout(() => {
              this._IpSearchListService.insertIPDDischargSummaryTemplate(data).subscribe(response => {
                this.toastr.success(response.message);
                // this.viewgetDischargesummaryPdf(response.admissionId)
                this._matDialog.closeAll();
              }, (error) => {
                this.toastr.error(error.message);
              });
  
            }, 500);
  
          }
          else {
            dischargModeldata['updatedBy'] =this.accountService.currentUserValue.userId
            var data1 = {
              "discharge": dischargModeldata,
              "prescriptionTemplate": insertIPPrescriptionDischarge
            }
            console.log(data1);
           
            setTimeout(() => {
              this._IpSearchListService.UpdateIPDDischargSummaryTemplate(data1).subscribe(response => {
                this.toastr.success(response.message);
                // this.viewgetDischargesummaryPdf(response.admissionId)
                this._matDialog.closeAll();
              }, (error) => {
                this.toastr.error(error.message);
              });
  
            }, 500);
  
          }
        }
        })
    }
  
  
    viewgetDischargesummaryPdf(AdmId) {
      this.commonService.Onprint("AdmissionID", AdmId, "IpDischargeSummaryReport");
    }
  
  
    viewgetDischargesummaryTempPdf(AdmId) {
  
    }
    getItemMaster() {
      // const dialogRef = this._matDialog.open(AddItemComponent,
      //   {
      //     maxWidth: "60vw",
      //     maxHeight: "65vh",
      //     width: '100%',
      //     height: "100%" 
      //   });
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed - Insert Action', result);
      // });
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
  
    onChangetemp(e){
      console.log(e)
      this.Tempdesc=e.templateDescription
      if(e.templateId > 0)
      this.isItemIdSelected=true
    }

    onAddTemplate(e) {
      this.vTemplateDesc=this.Tempdesc
     
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
  