import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstant } from '../shared/gobal-constant';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormBuilder;
  responseMessage: any;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private snackbarServices: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],
      password: ['', Validators.required],
    });
  }

  signUp() {
    // console.log('its ok');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  handleLogin() {
    //
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password,
    };
    this.userService.login(data).subscribe(
      (res: any) => {
        console.log(res);

        this.ngxService.stop();
        this.dialogRef.close();
        localStorage.setItem('token', res.token);
        console.log(res.pic);

        localStorage.setItem('userPic', JSON.stringify(res.pic));
        this.router.navigate(['/cafe/dashboard']);
      },
      (err) => {
        if (err.error?.message) {
          this.ngxService.stop();
          this.responseMessage = err.error?.message;
        }
        this.snackbarServices.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
}
