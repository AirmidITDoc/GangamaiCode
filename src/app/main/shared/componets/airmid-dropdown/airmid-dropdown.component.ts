import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
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
    @Output() selectDdlObject = new EventEmitter<any>();
    apiUrl: string = "Dropdown/GetBindDropDown?mode=";

    control: FormControl = new FormControl();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() IsMultiPle: boolean;

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



    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, @Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
        }
    }
    filteredDdls: Observable<string[]>;
    protected ddls: any[] = [];
    isSelected: boolean = false;

    public filteredDdls1: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    static nextId: number = 0;


    protected _onDestroy = new Subject<void>();
    stateChanges: Subject<void> = new Subject();
    ngOnInit() {
        this.bindGridAutoComplete();

        this.filteredDdls = this.formGroup.get(this.formControlName).valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
        );
    }
    options1: any[] = [];

    bindGridAutoComplete() {
        debugger
        if (this.options?.length > 0) {
            this.ddls = this.options as [];

            this.filteredDdls = this.formGroup.get(this.formControlName).valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filter(value) : this.ddls.slice()),
            );
        } else {
            this._httpClient
                .GetData(this.apiUrl + this.mode)
                .subscribe((data: any) => {
                    console.log(data)
                    this.ddls = data as [];
                    this.options1 = this.ddls.slice();
                    this.filteredDdls1.next(this.ddls.slice());

                    this.filteredDdls = this.formGroup.get(this.formControlName).valueChanges.pipe(
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



    private _filter(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.options1.filter(option => option.text.toLowerCase().includes(filterValue));
        }

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

    @Input()
    get value(): string {
        return this.control.value;
    }
    set value(value: string) {
        this.control.setValue(value);
        this.stateChanges.next();
    }
    @HostBinding()
    id = `input-control-${++AirmidDropdownComponent.nextId}`;

    public onDdlChange($event) {
        this.formGroup.controls[this.formControlName].setValue($event.value);
        this.selectDdlObject.emit($event.value);
    }
}
