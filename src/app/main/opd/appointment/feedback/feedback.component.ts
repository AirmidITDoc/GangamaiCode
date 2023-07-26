import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AppointmentSreviceService } from "../appointment-srevice.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";

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

    feedbackFormGroup: FormGroup;
    msg: any;

    constructor(
        public _opappointmentService: AppointmentSreviceService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<FeedbackComponent>,
        private formBuilder: FormBuilder,
        private _httpClient: HttpClient
    ) {}

    ngOnInit(): void {
        this.feedbackFormGroup = this.createFeedbackForm();
    }

    createFeedbackForm() {
        return this.formBuilder.group({
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

    submitFeedbackForm() {
        //  console.log(this.feedbackFormGroup.value);

        if (this.feedbackFormGroup.valid) {
            var m_data = {
                feedbackInsert: {
                    PatientName: this.feedbackFormGroup
                        .get("PatientName")
                        .value.trim(),
                    MobileNo: this.feedbackFormGroup.get("MobileNo").value,
                    Appointment: this.feedbackFormGroup.get("opdRadio").value,
                    ReceptionEnquiry:
                        this.feedbackFormGroup.get("recpRadio").value,
                    SignBoards: this.feedbackFormGroup.get("signRadio").value,
                    StaffBehaviour:
                        this.feedbackFormGroup.get("staffBehvRadio").value,
                    ClinicalStaff:
                        this.feedbackFormGroup.get("clinicalStaffRadio").value,
                    DoctorsTreatment:
                        this.feedbackFormGroup.get("docTreatRadio").value,
                    Cleanliness: this.feedbackFormGroup.get("cleanRadio").value,
                    Radiology:
                        this.feedbackFormGroup.get("radiologyRadio").value,
                    Pathology:
                        this.feedbackFormGroup.get("pathologyRadio").value,
                    Security: this.feedbackFormGroup.get("securityRadio").value,
                    Parking: this.feedbackFormGroup.get("parkRadio").value,
                    Pharmacy: this.feedbackFormGroup.get("pharmaRadio").value,
                    Physiotherapy:
                        this.feedbackFormGroup.get("physioRadio").value,
                    Canteen: this.feedbackFormGroup.get("canteenRadio").value,
                    SpeechTherapy:
                        this.feedbackFormGroup.get("speechRadio").value,
                    Dietation: this.feedbackFormGroup.get("dietRadio").value,
                    comment: this.feedbackFormGroup
                        .get("commentText")
                        .value.trim(),
                },
            };

            this.feedbackInsert(m_data).subscribe((data) => {
                this.msg = data;
            });
        }
    }

    feedbackInsert(m_data) {
        console.log(m_data);
        return this._httpClient.post(
            "Generic/GetByProc?procName=..... ",
            m_data
        );
    }
}
