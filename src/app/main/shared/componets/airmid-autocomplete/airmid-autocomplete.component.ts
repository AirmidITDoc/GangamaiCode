import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'airmid-autocomplete',
    templateUrl: './airmid-autocomplete.component.html',
    styleUrls: ['./airmid-autocomplete.component.scss']
})
export class AirmidAutocompleteComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() options: any[] = [];
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() TextKey: string = "Text";
    @Input() ValueKey: string = "Id";
    @Input() value: any;
    constructor() { }
    /** list of banks */
    protected banks: any[] = [
        {name: 'Bank A (Switzerland)', id: 'A'},
        {name: 'Bank B (Switzerland)', id: 'B'},
        {name: 'Bank C (France)', id: 'C'},
        {name: 'Bank D (France)', id: 'D'},
        {name: 'Bank E (France)', id: 'E'},
        {name: 'Bank F (Italy)', id: 'F'},
        {name: 'Bank G (Italy)', id: 'G'},
        {name: 'Bank H (Italy)', id: 'H'},
        {name: 'Bank I (Italy)', id: 'I'},
        {name: 'Bank J (Italy)', id: 'J'},
        {name: 'Bank Kolombia (United States of America)', id: 'K'},
        {name: 'Bank L (Germany)', id: 'L'},
        {name: 'Bank M (Germany)', id: 'M'},
        {name: 'Bank N (Germany)', id: 'N'},
        {name: 'Bank O (Germany)', id: 'O'},
        {name: 'Bank P (Germany)', id: 'P'},
        {name: 'Bank Q (Germany)', id: 'Q'},
        {name: 'Bank R (Germany)', id: 'R'}
      ];

    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();

    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    ngOnInit() {
        // set initial selection
        this.bankCtrl.setValue(this.banks[10]);

        // load the initial bank list
        this.filteredBanks.next(this.banks.slice());

        // listen for search field value changes
        this.bankFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBanks();
            });
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
     * Sets the initial value after the filteredBanks are loaded initially
     */
    protected setInitialValue() {
        this.filteredBanks
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredBanks are loaded initially
                // and after the mat-option elements are available
                this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
            });
    }

    protected filterBanks() {
        if (!this.banks) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredBanks.next(this.banks.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(
            this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
        );
    }
    // myControl = new FormControl();
    // myControl1 = new FormControl();
    // //options: string[] = ['One', 'Two', 'Three'];
    // filteredOptions: Observable<string[]>;

    // ngOnInit() {
    //     this.filteredOptions = this.myControl.valueChanges.pipe(
    //         startWith(''),
    //         map(value => this._filter(value))
    //     );
    // }

    // private _filter(value: string): string[] {
    //     const filterValue = value.toLowerCase();

    //     return this.options.filter(option => option[this.TextKey].toLowerCase().indexOf(filterValue) === 0);
    // }
    // SelectItem(val:any){
    //     debugger
    // }

}
