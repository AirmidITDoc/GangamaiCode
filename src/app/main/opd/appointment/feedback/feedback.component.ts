import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AppointmentSreviceService } from "../appointment-srevice.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { AppointmentService } from "../appointment.service";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";
import { MatStepper } from "@angular/material/stepper";

@Component({
    selector: "app-feedback",
    templateUrl: "./feedback.component.html",
    styleUrls: ["./feedback.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FeedbackComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

    feedbackFormGroup: UntypedFormGroup;
    msg: any;
    PrefixList: any;
    bankFilterCtrl: any;
    filteredPrefix: any;
    personalFormGroup: any;
    registerObj: any;
    GenderList: Object;
    selectedPrefixID: any;
    DoctorList: Object;
    filteredDoctor: any;
    VisitFormGroup: any;
    Doctor2List: Object;
    doctorFilterCtrl: any;

    
    filteredOptions: any;
    noOptionFound: boolean = false;
    isRegSearchDisabled: boolean = true;
  isDepartmentSelected: any;

    
  // prefix filter
  private filterPrefix() {
    if (!this.PrefixList) {

    return;
  }
  // get the search keyword
  let search = this.bankFilterCtrl.value;
  if (!search) {
    this.filteredPrefix.next(this.PrefixList.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filteredPrefix.next(
    this.PrefixList.filter(bank => bank.PrefixName.toLowerCase().indexOf(search) > -1)
  );
}
  constructor(
      public _opappointmentService: AppointmentService,
      public _matDialog: MatDialog,
      public dialogRef: MatDialogRef<FeedbackComponent>,
      private formBuilder: UntypedFormBuilder,
      private _httpClient: HttpClient
  ) {}

  
  ngOnInit(): void {
      this.feedbackFormGroup = this.createFeedbackForm();
      // this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
      // this.onChangeCityList(this.registerObj.CityId);
      // this.personalFormGroup.updateValueAndValidity();
  }
  onChangeCityList(CityId: any) {
      throw new Error("Method not implemented.");
  }
  onChangeGenderList(prefixObj) {
      if (prefixObj) {
        this._opappointmentService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
          this.GenderList = data;
          this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
          // this.selectedGender = this.GenderList[0];
          this.selectedPrefixID = this.GenderList[0].PrefixID;
        });
      }
    }

    //Patient search
     getSearchList() {
      debugger
  
      var m_data={
        "Keyword":`${this.feedbackFormGroup.get('RegId').value}%`
      }
      if (this.feedbackFormGroup.get('RegId').value.length >= 1) {
        this._opappointmentService.getRegistrationList(m_data).subscribe(resData => {
          // debugger;
  
          this.filteredOptions = resData;
          console.log(resData);
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
  
        });
      }
  
    }


    getOptionText(option) {
      if (!option) return '';
      return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
    }


    getSelectedObj(obj) {
      console.log('obj==', obj);
      this.registerObj = new AdmissionPersonlModel({});
                  this.registerObj = obj;
      
    }
  


DocSelectdelete(){
  
 
  this.VisitFormGroup.get('RefDocId').setValue(null);

this.getDoctor2List();
}


getDoctor2List() {
  this._opappointmentService.getDoctorMaster2Combo().subscribe(data => { this.Doctor2List = data; })
}


  createFeedbackForm() {
      return this.formBuilder.group({
        RegId:[''],
          DoctorList:[""],
          PrefixName:[""],
          PatientName: [""],
          MobileNo: [""],
          opdRadio: [""],
          recpRadio: [""],
          signRadio: [""],
          staffBehvRadio: [""],
          clinicalStaffRadio: [""],
          docTreatRadio: [""],
          cleanRadio: [""],
          radiologyRadio: [""],
          pathologyRadio: [""],
          securityRadio: [""],
          parkRadio: [""],
          pharmaRadio: [""],
          physioRadio: [""],
          canteenRadio: [""],
          speechRadio: [""],
          dietRadio: [""],
          commentText: "",
      });
  }

  onClose() {
      this.dialogRef.close();
  }

  clearForm() {
      this.feedbackFormGroup.reset(); // Resets the formgroup
  }
  

  // onChange(event) {
  //
  //         console.log(event.value);
  //
  // }
/*API used code*/

  submitFeedbackForm() {
    debugger
      //  console.log(this.feedbackFormGroup.value);
      if (this.feedbackFormGroup.valid) {
          // var m_data = {
          //     feedbackInsert: {
          //         PatientName: this.feedbackFormGroup
          //             .get("PatientName")
          //             .value.trim(),
          //         MobileNo: this.feedbackFormGroup.get("MobileNo").value,
          //         Appointment: this.feedbackFormGroup.get("opdRadio").value,
          //         ReceptionEnquiry:
          //             this.feedbackFormGroup.get("recpRadio").value,
          //         SignBoards: this.feedbackFormGroup.get("signRadio").value,
          //         StaffBehaviour:
          //             this.feedbackFormGroup.get("staffBehvRadio").value,
          //         ClinicalStaff:
          //             this.feedbackFormGroup.get("clinicalStaffRadio").value,
          //         DoctorsTreatment:
          //             this.feedbackFormGroup.get("docTreatRadio").value,
          //         Cleanliness: this.feedbackFormGroup.get("cleanRadio").value,
          //         Radiology:
          //             this.feedbackFormGroup.get("radiologyRadio").value,
          //         Pathology:
          //             this.feedbackFormGroup.get("pathologyRadio").value,
          //         Security: this.feedbackFormGroup.get("securityRadio").value,
          //         Parking: this.feedbackFormGroup.get("parkRadio").value,
          //         Pharmacy: this.feedbackFormGroup.get("pharmaRadio").value,
          //         Physiotherapy:
          //             this.feedbackFormGroup.get("physioRadio").value,
          //         Canteen: this.feedbackFormGroup.get("canteenRadio").value,
          //         SpeechTherapy:
          //             this.feedbackFormGroup.get("speechRadio").value,
          //         Dietation: this.feedbackFormGroup.get("dietRadio").value,
          //         comment: this.feedbackFormGroup
          //             .get("commentText")
          //             .value.trim(),
          //     },
          // };
          let feedbackarr = [];
          // this.dataSource.data.forEach((element) => {
      
          let feedbackdata = {};
          feedbackdata['patientFeedbackId'] = 0;
          feedbackdata['oP_IP_ID'] =  this.registerObj.RegId;
          feedbackdata['oP_IP_Type'] = 0;
          feedbackdata['feedbackCategory'] = "cat1";
          feedbackdata['feedbackRating'] = "Rat1";
          feedbackdata['feedbackComments'] = this.feedbackFormGroup.get('commentText').value;
          feedbackdata['addedBy'] = 10;
          feedbackarr.push(feedbackdata);

      // });
          
          let submitDataPay = {
              patientFeedbackInsert:feedbackarr
          };
          
          console.log(submitDataPay)
          this._opappointmentService.feedbackInsert(submitDataPay).subscribe(response => {
              if (response) {
                Swal.fire('', 'success').then((result) => {
               
                });
              } else {
                Swal.fire('Error !');
              }
              
            });


      }

  }
/*API used end code*/
  // feedbackInsert(m_data) {
  //     console.log(m_data);
  //     return this._httpClient.post(
  //         "Generic/GetByProc?procName=..... ",
  //         m_data
  //     );
  // }
}

