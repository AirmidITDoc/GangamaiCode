import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
    selector: 'app-error-0',
    templateUrl: './error-0.component.html',
    styleUrls: ['./error-0.component.scss']
})
export class Error0Component {
    countdown: number;

    constructor(
        public dialogRef: MatDialogRef<Error0Component>, private authenticationService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: { countdown: number }
    ) {
        this.countdown = data.countdown;
    }

    ngOnInit() {
        const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown % 30 == 0) {
                this.authenticationService.getCaptcha().subscribe((data) => {
                    clearInterval(interval);
                    this.dialogRef.close();
                });
            }
            if (this.countdown <= 0) {
                clearInterval(interval);
                this.dialogRef.close();
            }
        }, 1000);
    }

    closeNow() {
        this.dialogRef.close();
    }

}
