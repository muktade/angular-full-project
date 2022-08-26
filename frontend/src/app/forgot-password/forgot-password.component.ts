import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstant } from '../shared/gobal-constant';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassFromGroup: any = FormBuilder;
  responseMessage: any;

  constructor(
    private fromBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngxLoaderService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {}

  ngOnInit(): void {
    this.forgotPassFromGroup = this.fromBuilder.group({
      email: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],
    });
  }

  handleSubmit() {
    this.ngxLoaderService.start();
    var fromData = this.forgotPassFromGroup.value;
    console.log(fromData);
    var data = {
      email: fromData.email,
    };
    this.userService.forgotPassword(data).subscribe(
      (response: any) => {
        console.log(response);

        this.ngxLoaderService.stop();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackbar(this.responseMessage, '');
      },
      (error) => {
        this.ngxLoaderService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
}
