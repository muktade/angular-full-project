import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/gobal-constant';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  displayColumn: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private billService: BillService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.billService.getBills().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
      },
      (err) => {
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

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handelViewAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: value,
    };
    dialogConfig.width = '450px';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  downloadBill(value: any) {
    this.ngxService.start();
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.totalAmount,
      productDetails: value.productDetails,
    };
    this.billService.getPDF(data).subscribe((res: any) => {
      saveAs(res, value.uuid + '.pdf');
      this.ngxService.stop();
    });
    this.ngxService.stop();
  }

  handleDeleteAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + value.name + ' bill',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const dub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (res) => {
        this.ngxService.start();
        this.deleteBill(value.id);
        dialogRef.close();
      }
    );
  }

  deleteBill(id: any) {
    this.billService.deleteBill(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = res.message;
        this.snackbarService.openSnackbar(this.responseMessage, 'success');
      },
      (err) => {
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
