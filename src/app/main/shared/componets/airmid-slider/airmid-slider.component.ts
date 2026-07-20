import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NgControl
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
    selector: 'app-airmid-slider',
    templateUrl: './airmid-slider.component.html',
    styleUrls: ['./airmid-slider.component.scss']
})
export class AirmidSliderComponent implements ControlValueAccessor,
    OnInit,
    OnDestroy {
    static nextId: number = 0;

    private _disabled: boolean = false;
    private _focused: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;
    private destroy: Subject<void> = new Subject();
    color = 'accent';
    control = new FormControl();
    stateChanges: Subject<void> = new Subject();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() maxLength: number = 50;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() type: string = "text";
    @Input() keyup: Event;
    @Input() ValueField: string = "value";

    @Input() width: number = 100;
    empty: any;
    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    @Input()
    set value(val: boolean) {
        this.writeValue(val);
    }



    @HostBinding('attr.aria-describedby')
    describedBy: string = '';

    // @HostBinding()
    // id = `input-control-${++AirmidTextboxComponent.nextId}`;

    @HostBinding('class.floating')
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }
    get focused(): boolean {
        return this._focused;
    }
    set focused(value: boolean) {
        this._focused = value;
        this.stateChanges.next();
    }


    constructor(@Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }



    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
        this.stateChanges.complete();
    }

    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(' ');
    }

    setDisabledState(shouldDisable: boolean): void {
        if (shouldDisable) {
            this.control.disable();
        } else {
            this.control.enable();
        }

        this.disabled = shouldDisable;
    }

    onContainerClick(event: MouseEvent): void {
        // if ((event.target as Element).tagName.toLowerCase() !== 'input') {
        //   this.focusMonitor.focusVia(this.areaRef.nativeElement, 'mouse');
        // }
    }

    writeValue(value: boolean): void {
        this.control.setValue(value, {
            emitEvent: false
        });
    }

    ngOnInit() {

    }
}
