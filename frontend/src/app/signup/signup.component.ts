import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

import { Router } from '@angular/router';
// import { FileValidator } from 'ngx-material-file-input';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstant } from '../shared/gobal-constant';
// import { FileValidator } from 'ngx-material-file-input';
// import {
//   AcceptValidator,
//   MaxSizeValidator,
// } from '@angular-material-components/file-input';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any = FormBuilder;
  responseMessage: any;
  // readonly maxSize = 104857600;
  // fileControl: FormControl;
  // public files: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarServices: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService
  ) {
    /////////////
    // this.fileControl = new FormControl(this.files, [
    //   Validators.required,
    //   MaxSizeValidator(this.maxSize * 1024),
    // ]);
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(GlobalConstant.emailRegex)],
      ],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(GlobalConstant.contactNumberRegex),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  handleSubmit() {
    this.ngxService.start();

    var formData = this.signupForm.value;
    // console.log(formData);

    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      pic: this.imgURL,
    };
    // console.log(data.name);

    this.userService.signup(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarServices.openSnackbar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarServices.openSnackbar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
  ///////
  selectedFile: any;
  selectedFileNames: string = '';
  previews: string = '';
  imgURL: any;
  rURL: any;
  ///////////////////////
  selectFiles(event: any): void {
    console.log(event);
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.viewImag(this.selectedFile);
    }
  }

  /////imag view
  viewImag(picFile: any) {
    console.log(picFile);

    let reader = new FileReader();
    this.rURL = reader.readAsDataURL(picFile);
    console.log(this.rURL);

    reader.onload = (e) => {
      this.imgURL = reader.result;
      console.log(this.imgURL);
    };
  }
}
