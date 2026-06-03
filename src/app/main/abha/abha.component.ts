import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

type AppMode = 'create' | 'verify';
@Component({
    selector: 'app-abha',
    templateUrl: './abha.component.html',
    styleUrls: ['./abha.component.scss']
})
export class AbhaComponent implements OnInit {
    ngOnInit(): void {
        //throw new Error('Method not implemented.');
    }
    title = 'ABHA Management';
    mode: AppMode = 'create';

    setMode(m: AppMode): void {
        this.mode = m;
    }
}
