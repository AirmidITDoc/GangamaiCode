import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PaymentmodechangesService } from '../paymentmodechanges.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PaymentChange } from '../paymentmodechanges.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-newedipamode',
  templateUrl: './newedipamode.component.html',
  styleUrls: ['./newedipamode.component.scss']
})
export class NewedipamodeComponent {

  
}
