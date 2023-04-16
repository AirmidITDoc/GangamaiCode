import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ServiceMasterService } from 'app/main/setup/billing/service-master/service-master.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'contacts-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class ContactsMainSidebarComponent implements OnInit, OnDestroy {
    traiffs: any;
    doctors: any;
    groups: any;
    classes: any;
    filterBy: string;
    filterForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ServiceMasterService} _serviceMastersService
     */
    constructor(
        private _serviceMastersService: ServiceMasterService,
        private formBuilder: FormBuilder
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.filterBy = this._serviceMastersService.filterBy || 'all';

        this._serviceMastersService.onGroupsDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((groups: any) => {
                this.groups = groups;
            });

        this._serviceMastersService.onTraiffsDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((traiffs: any) => {
                this.traiffs = traiffs;
            });

        this._serviceMastersService.onDoctorsDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctors: any) => {
                this.doctors = doctors;
            });

        this._serviceMastersService.onClassesDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((classes: any) => {
                this.classes = classes;
            });

        this.filterForm = this.formBuilder.group({
            traiff: '',
            group: '',
            class: '',
            serviceId: '',
            serviceName: '',
            newTraiff: ''
        });

        this.onChanges();
    }

    onChanges(): void {
        this.filterForm.valueChanges.subscribe(val => {
            console.log(val)
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Change the filter
     *
     * @param filter
     */
    // changeFilter(filter): void {
    //     this.filterBy = filter;
    //     this._contactsService.onFilterChanged.next(this.filterBy);
    // }
}
