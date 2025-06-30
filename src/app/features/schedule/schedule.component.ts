import { Component, inject, OnInit } from '@angular/core';
import { Schedule } from '../../shared/models/schedule.model';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ApiService } from '../../core/services/api.service';
import {MatSnackBarModule, 
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedule',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit{

  displayedColumns: string[] = ['no.', 'hour_ini', 'hour_fin', 'status' ,'options'];
  readonly dialog = inject(MatDialog);
  schedule: Schedule[] = [];
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private apiService: ApiService){}

  async ngOnInit() {
    await this.getSchedule();
  }

  getSchedule()
  {
    return new Promise((resolve)=>{
      this.apiService.getAllSchedule().subscribe(
        (res)=>{
          this.schedule = res.data;
          resolve(true);
        }
      );
    });
  }

  editSchedule(schedule: Schedule) {
    let data = JSON.parse(JSON.stringify(schedule));
    const dialogRef = this.dialog.open(ScheduleFormComponent, {
      data: {schedule: data}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        await this.getSchedule();
      }
    });
  }

  newSchedule()
  {
    const dialogRef = this.dialog.open(ScheduleFormComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        await this.getSchedule();
      }
    });
  }

  deleteSchedule(id: number)
  {
    this.apiService.deleteSchedule(id).subscribe({
      next: async () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        await this.getSchedule();
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.error.message, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });
  }
}
