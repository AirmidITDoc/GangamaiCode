import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbhaService } from '../../abha.service';

@Component({
  selector: 'app-mobile-step',
  templateUrl: './mobile-step.component.html',
  styleUrls: ['./mobile-step.component.scss']
})
export class MobileStepComponent implements OnInit {
  @Input() form!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  aadhaarLinkedMobile: string;

  constructor(private abhaService: AbhaService) {
    //this.aadhaarLinkedMobile = this.abhaService.AADHAAR_LINKED_MOBILE;
  }

  ngOnInit(): void {
    // Pre-fill with the Aadhaar-linked mobile by default
    if (!this.form.value.mobileNumber) {
      this.form.patchValue({ mobileNumber: this.aadhaarLinkedMobile });
    }
  }

  get isAadhaarLinked(): boolean {
    return this.form.value.mobileNumber === this.aadhaarLinkedMobile;
  }

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '').slice(0, 10);
    if (input.value !== cleaned) {
      input.value = cleaned;
      this.form.get('mobileNumber')?.setValue(cleaned);
    }
  }

  onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
