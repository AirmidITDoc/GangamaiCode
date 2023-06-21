import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AppointmentSreviceService } from "../appointment-srevice.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { MatRadioModule } from "@angular/material/radio/radio-module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { valuesIn } from "lodash";

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

    constructor(
        public _opappointmentService: AppointmentSreviceService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<FeedbackComponent>,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.feedbackFormGroup = this.createFeedbackForm();
    }

    createFeedbackForm() {
        return this.formBuilder.group({
            PatientName: [""],
            MobileNo: [""],
            opdRadio: ["5"],
            recpRadio: ["5"],
            signRadio: ["5"],
            staffBehvRadio: ["5"],
            clinicalStaffRadio: ["5"],
            docTreatRadio: ["5"],
            cleanRadio: ["5"],
            radiologyRadio: ["5"],
            pathologyRadio: ["5"],
            securityRadio: ["5"],
            parkRadio: ["5"],
            pharmaRadio: ["5"],
            physioRadio: ["5"],
            canteenRadio: ["5"],
            speechRadio: ["5"],
            dietRadio: ["5"],
            commentText: "",
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    clearForm() {
        this.feedbackFormGroup.reset(); // Resets the formgroup
    }
    // onChangeReg(event) {
    //
    //         console.log(event.value);
    //
    // }
    submitFeedbackForm() {
        console.log(this.feedbackFormGroup.value);
    }
}
