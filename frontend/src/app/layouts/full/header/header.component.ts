import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class AppHeaderComponent {
  token: any = localStorage.getItem('token');
  public userInfo: any;
  role: any;
  pice: any;
  picData: any[];
  userPic: any;
  constructor(private router: Router, private dialog: MatDialog) {
    this.userInfo = jwt_decode(this.token);
    console.log(this.userInfo);
    this.userPic = JSON.parse(localStorage.getItem('userPic') || '{}');
    console.log(this.userPic);
    // console.log(this.pice.length);

    // for(let i =0; i<this.pice.length;i++){

    // }
    this.picData = this.userPic.data;
    // console.log(this.picData);
    this.picString(this.picData);
  }
  ///////////// pic array to string
  picString(pcDt: any) {
    let picIs: string = '';
    let puArray: any[] = pcDt;
    for (let i = 0; i < puArray.length; i++) {
      picIs = picIs + String.fromCharCode(puArray[i]);
      // console.log(puArray[i]);
    }
    // console.log(picIs);
    this.pice = picIs;
  }

  logout() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: 'Logout?',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (user) => {
        dialogRef.close();
        localStorage.clear();
        this.router.navigate(['/']);
      }
    );
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
