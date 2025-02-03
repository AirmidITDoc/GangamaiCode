import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { VisitMaster1 } from '../appointment-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';


@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CrossConsultationComponent implements OnInit {
  crossconForm: FormGroup;
  date = new Date().toISOString();
  
  screenFromString = 'admission-form';
  Departmentid = 0;
  DoctorID = 0;
  DoctorID1 = 0
  registerObj1 = new VisitMaster1({});
  

  autocompleteModedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";
  @ViewChild('ddldoctor') ddldoctor: AirmidDropDownComponent;

  docList: any = [];
  optionsDoctor: any[] = [];
  filteredOptionsdoc: Observable<string[]>;
  isdocSelected: boolean = false;

  constructor(public _AppointmentlistService: AppointmentlistService, private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CrossConsultationComponent>, public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) {
   
  }

  ngOnInit(): void {   
      if ((this.data?.visitId ?? 0) > 0) {
      setTimeout(() => {
        this._AppointmentlistService.getVisitById(this.data.visitId).subscribe((response) => {
          this.registerObj1 = response;
          this.registerObj1.visitTime= this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm')
          console.log(response)
        });
      }, 500);
    }
   
    this.crossconForm = this.createCrossConForm();
   
  }


  createCrossConForm() {
    
    return this.formBuilder.group({
      visitId: 0,
      regId: 0,
      visitDate:"",// this.registerObj1.visitTime,
      visitTime:" ",// this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm'),
      unitId: this.registerObj1.unitId,
      patientTypeId: this.registerObj1.patientTypeId,
      consultantDocId: this.registerObj1.consultantDocId,
      refDocId: this.registerObj1.refDocId,
      tariffId: this.registerObj1.tariffId,
      companyId: this.registerObj1.companyId,
      addedBy: 1,
      updatedBy: 1,
      isCancelled: true,
      isCancelledBy: 0,
      isCancelledDate: new Date(),
      classId: this.registerObj1.classId,
      departmentId: this.registerObj1.departmentId,
      patientOldNew: this.registerObj1.patientOldNew,
      firstFollowupVisit: 0,
      appPurposeId: 0,//this.registerObj1.VisitDate,
      followupDate: new Date(),
      crossConsulFlag: 1,
      phoneAppId: 0,// this.registerObj1.VisitDate,

    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

   
  getValidationMessages() {
    return {
      Departmentid: [
        { name: "required", Message: "Department Name is required" }
      ],
      consultantDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }
  selected=""
  selectChange(obj){
    this.selected=obj
    console.log(obj)
  }

  onSubmit() {
    console.log(this.crossconForm.value);
   
    let data=this.crossconForm.value;
    data.departmentId=this.crossconForm.get('departmentId').value
    data.consultantDocId=parseInt(this.crossconForm.get('consultantDocId').value)
    data.visitTime=this.datePipe.transform(this.crossconForm.get('visitTime').value,'yyyy-MM-ddTHH:mm')
    data.visitDate=this.datePipe.transform(this.crossconForm.get('visitTime').value,'yyyy-MM-dd')

    data.visitId=0;
    data.addedBy=0;
    data.updatedBy=0;

    console.log(data);
    this._AppointmentlistService.crossconsultSave(data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }

  onClear(val: boolean) {
    this.crossconForm.reset();
    this.dialogRef.close(val);
  }
  onClose() {
    this.dialogRef.close();
  }

  selectChangedepartment(e){
    this.ddldoctor.SetSelection(e.departmentId);
  }

}


