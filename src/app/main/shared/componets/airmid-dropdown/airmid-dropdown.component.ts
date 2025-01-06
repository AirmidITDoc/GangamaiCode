import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-airmid-dropdown',
    templateUrl: './airmid-dropdown.component.html',
    styleUrls: ['./airmid-dropdown.component.scss']
})
export class AirmidDropdownComponent implements OnInit {

    @Input() options: any[] = [];
    @Input() mode: string;
    @Output() selectionChange = new EventEmitter<any>();
    apiUrl: string = "Dropdown/GetBindDropDown?mode=";

    control: UntypedFormControl = new UntypedFormControl();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() IsMultiPle: boolean;
    @Input() TextField: string = "text";
    @Input() ValueField: string = "value";
    @Input() ApiUrl: string = "";

    private _disabled: boolean = false;
    private _focused: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    @Input()
    get placeholder(): string {
        return this._placeholder ?? this.label;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get errorState(): boolean {
        return this.ngControl.control !== null ? !!this.ngControl.control : false;
    }

    @Input()
    get value(): (string | []) {
        return this.control.value;
    }
    set value(value: (string | [])) {
        this.control.setValue(value);
        this.stateChanges.next();
    }


    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, @Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
        }
    }
    filteredDdls1: Observable<string[]>;
    protected ddls: any[] = [];
    isSelected: boolean = false;

    // public filteredDdls1: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    static nextId: number = 0;


    protected _onDestroy = new Subject<void>();
    stateChanges: Subject<void> = new Subject();
    ngOnInit() {
        this.bindGridAutoComplete();

        // this.filteredDdls = this.formGroup.get(this.formControlName).valueChanges.pipe(
        //     startWith(''),
        //     map((value) => this._filter(value || ''))
        // );

        this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),

        );
    }
    options1: any[] = [];

    bindGridAutoComplete1() {
        debugger
        if (this.options?.length > 0) {
            this.ddls = this.options as [];

            this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filter(value) : this.ddls.slice()),
            );
        } else {
            this._httpClient
                .GetData(this.ApiUrl + this.mode)
                .subscribe((data: any) => {
                    console.log(data)
                    this.ddls = data as [];
                    this.options1 = this.ddls.slice();
                    // this.filteredDdls1.next(this.ddls.slice());

                    this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
                        startWith(''),
                        map(value => value ? this._filter(value) : this.ddls.slice()),
                    );

                    if (this.value) {
                        console.log(this.value)
                        this.formGroup.get(this.formControlName).setValue(this.value.toString());
                        this.control.setValue(this.value.toString());
                        this.stateChanges.next();
                        this.changeDetectorRefs.detectChanges();
                    }
                });
        }

    }

    bindGridAutoComplete() {
        let control=this.formControlName
        console.log(control)
        if (this.options?.length > 0) {
            this.ddls = this.options as [];
            // this.filteredDdls1.next(this.ddls.slice());
            this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filter(value) : this.ddls.slice()),
            );
        } else {
            if (this.ApiUrl == "")
                this._httpClient
                    .GetData('Dropdown/GetBindDropDown?mode=' + this.mode)
                    .subscribe((data: any) => {
                        this.ddls = data as [];
                        // this.filteredDdls1.next(this.ddls.slice());
                        this.options1 = this.ddls.slice();
                        this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
                            startWith(''),
                            map(value => value ? this._filter(value) : this.ddls.slice()),
                        );
                        if (this.value) {
                            this.SetSelection(this.value);
                        }
                    });
            else
                this._httpClient
                    .GetData(this.ApiUrl)
                    .subscribe((data: any) => {
                        this.ddls = data as [];
                        // this.filteredDdls1.next(this.ddls.slice());
                        this.options1 = this.ddls.slice();
                        this.filteredDdls1 = this.formGroup.get(this.formControlName).valueChanges.pipe(
                            startWith(''),
                            map(value => value ? this._filter(value) : this.ddls.slice()),
                        );
                        if (this.value) {
                            if (this.IsMultiPle) {
                                if (this.value instanceof Array) {
                                    this.value = this.value.map(x => x[this.ValueField] ?? x) as [];
                                }
                            }
                            this.SetSelection(this.value);
                        }
                    });
        }

    }

    private _filter(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.options1.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }
    SetSelection(value) {
        if (this.IsMultiPle) {
            this.control.setValue(value);
            this.formGroup.get(this.formControlName).setValue(this.ddls.filter(x => value.indexOf(x[this.ValueField]) >= 0));
        }
        else {
            this.control.setValue(this.ddls.find(x => x[this.ValueField] == value.toString()));
            this.formGroup.get(this.formControlName).setValue(value.toString());
        }
        this.stateChanges.next();
        this.changeDetectorRefs.detectChanges();
        // this.selectDdlObject.emit(value);
    }
    getOptionText(option) {
        return option && option.text ? option.text : '';
    }
    ngAfterViewInit() {
        this.setInitialValue();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.stateChanges.complete();
    }
    protected setInitialValue() {
        // debugger
        // this.filteredDdls
        //     .pipe(take(1), takeUntil(this._onDestroy))
        //     .subscribe(() => {
        //         this.singleSelect.compareWith = (a: any, b: any) =>
        //             a && b && a.id === b.id;
        //     });
    }
    writeValue(value: string | null): void {
        this.control.setValue(value);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.SetSelection(changes.value.currentValue);
        }
    }
    @HostBinding()
    id = `input-control-${++AirmidDropdownComponent.nextId}`;

    public onDdlChange($event) {
        this.formGroup.controls[this.formControlName].setValue($event.value);
        this.selectionChange.emit($event.value);
    }
}
