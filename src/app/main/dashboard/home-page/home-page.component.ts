import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { FollowupListComponent } from 'app/main/opd/appointment-list/followup-list/followup-list.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class HomePageComponent {
    username: any;
    UserFollowup: boolean = false;
    constructor(
        public _accountServices: AuthenticationService, private dialogRef: MatDialog, public _ConfigService: ConfigService,
    ) {
    }

    ngOnInit(): void {
        this.username = this._accountServices.currentUserValue.userName
            ? this._accountServices.currentUserValue.userName
            : '';


        const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsFollowPOPWindowList');
        this.UserFollowup = access?.AccessValue;

        if (this.UserFollowup)
            this.onfollowuppatientsearch();
    }
    onfollowuppatientsearch() {
        const dialogRef = this.dialogRef.open(FollowupListComponent,
            {
                maxWidth: "80vw",
                // width: "85%",
                height: "80%",
                panelClass: 'responsive-dialog'
            });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }
}
