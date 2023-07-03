import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorComponent>,
    ) {
  }
  
  ngOnInit(): void {
    console.log(this.data.countries);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSuccess(): void {
    this.dialogRef.close(true);
  }
}
