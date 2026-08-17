import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSENT_ITEMS } from './abha-model';
import { Subscription } from 'rxjs';
import { AbhaService } from './abha.service';

type AppMode = 'create' | 'verify';
@Component({
    selector: 'app-abha',
    templateUrl: './abha.component.html',
    styleUrls: ['./abha.component.scss']
})
export class AbhaComponent implements OnInit {

    title = 'ABHA Management';
    mode: AppMode = 'create';
    consentItems = CONSENT_ITEMS;
    private sub!: Subscription;

    constructor(private abhaService: AbhaService) { }

    ngOnInit(): void {
        //throw new Error('Method not implemented.');
        this.sub = this.abhaService.switchToCreate$.subscribe(() => {
            console.log('AbhaComponent received switchToCreate event'); // TEMP debug log
            this.setMode('create');
        });
    }
    
     ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    setMode(m: AppMode): void {
        this.mode = m;

        // Reset all parent and child checkboxes
        this.consentItems.forEach(item => {
            item.checked = false;

            if (item.children) {
                item.children.forEach(child => {
                    child.checked = false;
                });
            }
        });
    }
}
