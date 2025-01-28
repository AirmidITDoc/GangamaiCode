import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef, Optional, Self, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: "airmid-autocomplete",
    templateUrl: "./airmid-autocomplete.component.html",
    styleUrls: ["./airmid-autocomplete.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirmidAutoCompleteComponent implements OnInit {
    @Input() filteredOptions: any[] = [];
    @Output() selectionChange = new EventEmitter<any>();
    private destroy: Subject<void> = new Subject();
    control = new FormControl();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() TextField: string = "text";
    @Input() ValueField: string = "value";
    @Input() ApiUrl: string = "";
    @Input() placeholderText: string = "Enter string";
    private _disabled: boolean = false;
    //private _placeholder: string = '';
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
        return this.placeholderText ?? this.label;
    }
    set placeholder(value: string) {
        this.placeholderText = value;
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

    get activeErrors(): string[] {
        try {
            if (!this.formGroup || this.formGroup[this.formControlName] || !this.validations || this.validations.length <= 0) {
                return [];
            }
            // Find active validation 
            return this.validations
                .filter((validation: any) => this.formGroup.controls[this.formControlName].hasError(validation.name.toLowerCase()))
                .map((validation: any) => validation.Message);
        } catch (error) {
            console.log("Textbox Error => ", error);
        }
    }
    @Input()
    get value(): (string | []) {
        return this.control.value;
    }
    set value(value: (string | [])) {
        if (value != this.control.value) {
            this.control.setValue(value);
            this.stateChanges.next();
        }
    }
    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }
    writeValue(value: string | null): void {
        this.control.setValue(value);
    }
    constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef, @Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }

    protected _onDestroy = new Subject<void>();
    stateChanges: Subject<void> = new Subject();
    ngOnInit() {
        //this.onSearchData("");
    }
    onSearchData(e: string) {
        if ((this.ApiUrl ?? "") != "") {
            if (e.length > 0) {
                this._httpClient.GetData(this.ApiUrl + e).subscribe((data: any) => {
                    this.filteredOptions = data as [];
                });
            }
            else
                this.filteredOptions = [];
        }
    }
    displayFn(user: any): string {
        return user[this["ariaLabel"]];
    }
    selectedOption(e: any) {
        this.selectionChange.emit(e);
        // from here you need to bind form.
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.stateChanges.complete();
    }
}