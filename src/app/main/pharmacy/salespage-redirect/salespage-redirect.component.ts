import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'app/core/services/config.service';

@Component({
    selector: 'app-salespage-redirect',
    template: '' // no HTML
})
export class SalespageRedirectComponent {
    KenyaSalesPage: boolean = false;
    constructor(
        private router: Router,
        private _ConfigService: ConfigService
    ) { }
    ngOnInit(): void {
        //this code for Mediforte 9 digit national id
        const rawValue = this?._ConfigService?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.KenyaSalesPage = id === "1";

        if (this.KenyaSalesPage) {
            this.router.url == '/pharmacy/salesreturn'
        } else {
            this.router.url == '/pharmacy/browsesalesbill'
        }
    }
}
