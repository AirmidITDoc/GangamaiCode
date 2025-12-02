import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';

export interface MedicineItem {
    DrugId?: number;
    drugId?: number;
    DrugName?: string;
    drugName?: string;
    DoseId?: number;
    DoseName?: string;
    doseName?: string;
    GenericName?: string;
    genericName?: string;
    GenericId?: number;
    genericId?: number;
    genericid?: number;
    Days?: number;
    days?: number;
    QtyPerDay?: number;
    qtyPerDay?: number;
    totalQty?: number;
    instruction?: string;
    Instruction?: string;
    editable?: boolean;
    OPD_IPD_IP?: any;
    PrecriptionId?: number;
    precriptionId?: number;
    presId?: number;
    Presid?: number;
}

@Component({
    selector: 'app-medicine-table-new',
    templateUrl: './medicine-table-new.component.html',
    styleUrls: ['./medicine-table-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MedicineTableNewComponent implements OnInit {

    @ViewChild('tableWrapper') tableWrapper: ElementRef<HTMLElement>;
    @Input() storeId: number;
    @Input() itemApiUrl: string;
    @Input() autocompleteModeItemGeneric: string = 'ItemGeneric';
    @Input() autocompleteModeDose: string = 'DoseMaster';

    @Output() dataChanged = new EventEmitter<MedicineItem[]>();

    displayedColumns: string[] = [
        'ItemName',
        'ItemGenericName',
        'DoseName',
        'Days',
        'Instruction',
        'Action'
    ];

    dsItemList = new MatTableDataSource<MedicineItem>();
    medicineForm: FormGroup;
    chargeList: MedicineItem[] = [];

    // Selected values
    private drugId: number = 0;
    private drugName: string = '';
    private doseId: number = 0;
    private doseName: string = '';
    private doseQtyPerDay: number = 0;
    private vDay: number = 0;
    private vItemGenericNameId: number = 0;
    private vItemGenericName: string = '';
    private vdoseName: string = '';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private toastr: ToastrService,
        private _casepaperService: CasepaperService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.ensurePlaceholderRowExists(false);
    }

    private initForm(): void {
        this.medicineForm = this._formBuilder.group({
            ItemId: [0, [Validators.required]],
            DoseId: [0, [Validators.required]],
            Day: ['', [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]],
            ItemGenericNameId: [''],
            Instruction: ['', [Validators.maxLength(200)]]
        });
    }

    get itemApiUrlFull(): string {
        return this.itemApiUrl || `ItemMaster/GetItemListForPrescription?StoreId=${this.storeId}&ItemName=`;
    }

    // Public method to set data from parent
    setData(data: MedicineItem[]): void {
        this.removePlaceholderRows();
        this.chargeList = [...data];
        this.dsItemList.data = this.chargeList;
        this.ensurePlaceholderRowExists(false);
    }

    // Public method to get current data
    getData(): MedicineItem[] {
        return this.dsItemList.data;
    }

    // Handle drug name selection
    onDrugSelected(row: any): void {
        this.drugId = row.itemId;
        this.drugName = row.itemName;
        this.vdoseName = row.doseName;
        this.vDay = row.doseDay;

        this.medicineForm.get('DoseId').setValue(this.vdoseName);

        if (this.vdoseName) {
            const doseRow = { value: this.vdoseName, text: this.vdoseName };
            this.onDoseSelected(doseRow);
        }

        if ((this.drugId ?? 0) > 0) {
            setTimeout(() => {
                this._casepaperService.getItemMasterById(this.drugId).subscribe((response: any) => {
                    this.vItemGenericNameId = response.itemGenericNameId;
                    this.medicineForm.get('ItemGenericNameId').setValue(this.vItemGenericNameId);

                    if ((this.vItemGenericNameId ?? 0) > 0) {
                        setTimeout(() => {
                            this._casepaperService.getItemGenericById(this.vItemGenericNameId).subscribe((genericResponse: any) => {
                                this.vItemGenericName = genericResponse.itemGenericName;
                            });
                        }, 300);
                    }
                });
            }, 300);
        }
    }

    // Handle generic name selection
    onGenericSelected(row: any): void {
        this.vItemGenericNameId = row.value;
        this.vItemGenericName = row.text;
    }

    // Handle dose selection
    onDoseSelected(row: any): void {
        this.doseId = row.value;

        if ((this.doseId ?? 0) > 0) {
            setTimeout(() => {
                this._casepaperService.getDoseMasterById(this.doseId).subscribe((response: any) => {
                    this.doseQtyPerDay = response.doseQtyPerDay;
                    this.doseName = response.doseName;
                });
            }, 300);
        }
    }

    // Reset form
    onFormReset(): void {
        this.medicineForm.patchValue({
            ItemId: '',
            DoseId: '',
            Day: '',
            Instruction: ''
        });
        this.drugId = 0;
        this.drugName = '';
        this.doseId = 0;
        this.doseName = '';
        this.vItemGenericNameId = 0;
        this.vItemGenericName = '';
    }

    // Add new row
    addNewRow(): void {
        const pendingRow = this.dsItemList.data.find(x => x.editable === true);

        if (pendingRow) {
            this.toastr.warning('Please confirm the current row before adding a new one!');
            return;
        }

        this.insertPlaceholderRow();
    }

    // Confirm row
    confirmRow(row: MedicineItem): boolean {
        if (!this.medicineForm.get('ItemId')?.value) {
            this.toastr.warning('Please select a Drug Name', 'Warning!');
            return false;
        }
        if (!this.medicineForm.get('DoseId')?.value) {
            this.toastr.warning('Please select a Dose Name', 'Warning!');
            return false;
        }
        if (!this.medicineForm.get('Day')?.value) {
            this.toastr.warning('Please enter Days', 'Warning!');
            return false;
        }

        const qty = this.doseQtyPerDay || 0;
        const days = this.medicineForm.get('Day').value || this.vDay;

        row.DrugId = this.drugId || 0;
        row.DrugName = this.drugName || '';
        row.DoseId = this.doseId || 0;
        row.GenericName = this.vItemGenericName || '';
        row.GenericId = this.vItemGenericNameId || 0;
        row.DoseName = this.doseName || '';
        row.Days = days;
        row.QtyPerDay = this.doseQtyPerDay || 0;
        row.totalQty = qty * days;
        row.instruction = this.medicineForm.get('Instruction').value || '';
        row.editable = false;

        this.dsItemList.data = [...this.dsItemList.data];
        this.emitDataChange();
        return true;
    }

    // Enable edit mode
    enableEdit(row: MedicineItem): void {
        this.removePlaceholderRows(row);
        this.dsItemList.data.forEach(r => (r.editable = false));
        row.editable = true;
        this.dsItemList.data = [...this.dsItemList.data];

        const drugControlValue = this.buildDrugAutocompleteValue(row);
        this.medicineForm.patchValue({
            ItemId: drugControlValue,
            Day: row.Days ?? row.days ?? '',
            Instruction: row.instruction ?? row.Instruction ?? '',
            ItemGenericNameId: (row.GenericId ?? row.genericId ?? row.genericid ?? '').toString(),
            DoseId: row.DoseId ?? ''
        }, { emitEvent: false });

        // Set local values for editing
        this.drugId = row.DrugId || 0;
        this.drugName = row.DrugName || row.drugName || '';
        this.doseId = row.DoseId || 0;
        this.doseName = row.DoseName || row.doseName || '';
        this.vItemGenericNameId = row.GenericId || row.genericId || row.genericid || 0;
        this.vItemGenericName = row.GenericName || row.genericName || '';
        this.focusFirstEditableField();
    }

    // Cancel edit
    cancelEdit(row: MedicineItem): void {
        // If it's a new row (no drug assigned), remove it
        if (!row.DrugId && !row.drugName) {
            const index = this.chargeList.indexOf(row);
            if (index >= 0) {
                this.chargeList.splice(index, 1);
                this.dsItemList.data = [...this.chargeList];
            }
        } else {
            row.editable = false;
            this.dsItemList.data = [...this.dsItemList.data];
        }
        this.resetFormFields();
    }

    // Delete row
    deleteRow(event: Event, element: MedicineItem): void {
        const index = this.chargeList.indexOf(element);
        if (index >= 0) {
            this.chargeList.splice(index, 1);
            this.dsItemList.data = [...this.chargeList];
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted!');
        this.emitDataChange();
    }

    // Reset form fields
    private resetFormFields(): void {
        this.medicineForm.get('ItemId').reset('');
        this.medicineForm.get('ItemGenericNameId').reset('');
        this.medicineForm.get('DoseId').reset('');
        this.medicineForm.get('Day').reset('');
        this.medicineForm.get('Instruction').reset('');
        this.vdoseName = '';
        this.drugId = 0;
        this.drugName = '';
        this.doseId = 0;
        this.doseName = '';
        this.vItemGenericNameId = 0;
        this.vItemGenericName = '';
    }

    // Emit data change event
    private emitDataChange(): void {
        this.dataChanged.emit(this.dsItemList.data);
    }

    onInstructionEnter(row: MedicineItem, event: KeyboardEvent): void {
        if (!row.editable) {
            return;
        }
        event.preventDefault();
        const wasExistingRecord = this.isExistingRow(row);
        const confirmed = this.confirmRow(row);
        if (confirmed) {
            this.handlePostConfirmation(row, wasExistingRecord);
        }
    }

    onConfirmClick(row: MedicineItem, event?: Event): void {
        event?.preventDefault();
        const wasExistingRecord = this.isExistingRow(row);
        const confirmed = this.confirmRow(row);
        if (confirmed) {
            this.handlePostConfirmation(row, wasExistingRecord);
        }
    }

    private focusFirstEditableField(): void {
        setTimeout(() => {
            const host = this.tableWrapper?.nativeElement;
            if (!host) {
                return;
            }
            const editingRow = host.querySelector('tr.editing-row');
            if (!editingRow) {
                return;
            }
            const autoInput = editingRow.querySelector('airmid-autocomplete input');
            if (autoInput instanceof HTMLInputElement) {
                autoInput.focus();
                return;
            }
            const firstInput = editingRow.querySelector('input');
            if (firstInput instanceof HTMLInputElement) {
                firstInput.focus();
                return;
            }
            const matSelect = editingRow.querySelector('mat-select');
            if (matSelect instanceof HTMLElement) {
                matSelect.dispatchEvent(new Event('click'));
            }
        }, 150);
    }

    private removePlaceholderRows(excludeRow?: MedicineItem): void {
        let removed = false;
        let index = this.chargeList.findIndex(item =>
            item !== excludeRow &&
            item.editable &&
            (!item.DrugId && !item.drugName));

        while (index >= 0) {
            this.chargeList.splice(index, 1);
            removed = true;
            index = this.chargeList.findIndex(item =>
                item !== excludeRow &&
                item.editable &&
                (!item.DrugId && !item.drugName));
        }

        if (removed) {
            this.dsItemList.data = [...this.chargeList];
        }
    }

    private insertPlaceholderRow(autoFocus: boolean = true): void {
        this.resetFormFields();

        const newRow: MedicineItem = {
            DrugName: '',
            GenericName: '',
            DoseName: '',
            Days: 0,
            instruction: '',
            editable: true
        };

        this.chargeList.unshift(newRow);
        this.dsItemList.data = [...this.chargeList];

        if (autoFocus) {
            this.focusFirstEditableField();
        }
    }

    private ensurePlaceholderRowExists(autoFocus: boolean = false): void {
        const hasEditableRow = this.dsItemList.data.some(row => row.editable === true);
        if (hasEditableRow) {
            return;
        }
        this.insertPlaceholderRow(autoFocus);
    }

    private isExistingRow(row: MedicineItem): boolean {
        return (row.DrugId ?? row.drugId ?? 0) > 0 ||
            (row.precriptionId ?? row.PrecriptionId ?? row.presId ?? row.Presid ?? 0) > 0;
    }

    private handlePostConfirmation(row: MedicineItem, wasExistingRecord: boolean): void {
        if (wasExistingRecord) {
            row.editable = false;
            this.dsItemList.data = [...this.dsItemList.data];
        }
        this.resetFormFields();
        this.ensurePlaceholderRowExists(true);
    }

    private buildDrugAutocompleteValue(row: MedicineItem): any {
        const drugName = row.DrugName || row.drugName || '';
        const drugId = row.DrugId ?? row.drugId ?? 0;

        if (!drugName && !(drugId > 0)) {
            return '';
        }

        return {
            formattedText: drugName,
            itemName: drugName,
            itemId: drugId,
            ItemId: drugId,
            doseName: row.DoseName || row.doseName || '',
            doseDay: row.Days || row.days || this.vDay
        };
    }
}
