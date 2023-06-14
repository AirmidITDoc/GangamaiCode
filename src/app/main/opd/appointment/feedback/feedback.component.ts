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
            nameInput: this.formBuilder.control(null),
            MobileNo: this.formBuilder.control(null),
            opdRadio: this.formBuilder.control(null),
            recpRadio: this.formBuilder.control(null),
            signRadio: this.formBuilder.control(null),
            staffBehvRadio: this.formBuilder.control(null),
            clinicalStaffRadio: this.formBuilder.control(null),
            docTreatRadio: this.formBuilder.control(null),
            cleanRadio: this.formBuilder.control(null),
            radiologyRadio: this.formBuilder.control(null),
            pathologyRadio: this.formBuilder.control(null),
            securityRadio: this.formBuilder.control(null),
            parkRadio: this.formBuilder.control(null),
            pharmaRadio: this.formBuilder.control(null),
            physioRadio: this.formBuilder.control(null),
            canteenRadio: this.formBuilder.control(null),
            speechRadio: this.formBuilder.control(null),
            dietRadio: this.formBuilder.control(null),
            commentText: this.formBuilder.control(null),
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    clearForm() {
        this.feedbackFormGroup.reset(); // Resets the formgroup
    }

    submitFeedbackForm() {
        console.log(this.feedbackFormGroup.value);
    }
}
