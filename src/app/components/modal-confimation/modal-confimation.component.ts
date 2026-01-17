import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confimation',
  templateUrl: './modal-confimation.component.html',
  styleUrls: ['./modal-confimation.component.css']
})
export class ModalConfimationComponent{

  constructor(
    public dialogRef: MatDialogRef<ModalConfimationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      titleColor?: string;
      message?: string;
      confirmText?: string;
      cancelText?: string;
      icon?: string;
      iconColor?: string;
      textColor?: string;
      bgColor?: string;
      btnBgColor?: string;
    }
  ) {}

   confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
