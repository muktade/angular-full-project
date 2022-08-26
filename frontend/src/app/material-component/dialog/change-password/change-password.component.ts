import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderComponent } from 'ngx-ui-loader/lib/core/ngx-ui-loader.component';
import { AppSidebarComponent } from 'src/app/layouts/full/sidebar/sidebar.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/gobal-constant';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = FormGroup;
  responseMessage: any;
  token: any = localStorage.getItem('token');
  public tokenPayload: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.tokenPayload = jwt_decode(this.token);
    console.log(this.tokenPayload);
    console.log(this.tokenPayload.role);
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  test() {
    console.log(this.validateSubmit());
  }

  validateSubmit() {
    if (
      this.changePasswordForm.controls['newPassword'].value !=
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      return false;
    } else {
      return true;
    }
  }

  handelChangePassword() {
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    let userEmail = this.tokenPayload.email;
    console.log(userEmail);

    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
      email: userEmail,
    };
    this.userService.changePassword(data).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.responseMessage = res?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackbar(this.responseMessage, 'Success');
      },
      (err) => {
        console.log(err);
        this.ngxService.stop();
        if (err.error?.message) {
          this.responseMessage = err.error?.message;
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
