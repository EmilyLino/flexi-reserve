import { Component, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule, 
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Schedule } from '../../../shared/models/schedule.model';
import {DIALOG_DATA} from '@angular/cdk/dialog';
import {MatTimepickerModule, MatTimepickerOption} from '@angular/material/timepicker';
import moment from 'moment';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-schedule-form',
  imports: [MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    MatTimepickerModule],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent {
  public _hourIni: Date | null = null;
  private _hourFin: Date | null = null;
  private _snackBar = inject(MatSnackBar);
  public isEdit: boolean = false;
  public scheduleToEdit: Schedule;
  readonly dialogRef = inject(MatDialogRef<ScheduleFormComponent>);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(@Inject(DIALOG_DATA) public data: {schedule: Schedule},
  private apiService: ApiService)
  {
    this._hourIni = null;
    this._hourFin = null;
    
    this.scheduleToEdit = { hour_ini: '', hour_fin: ''};
    
    if (data) this.setScheculeData(data.schedule);
  }

  public setScheculeData(schedule: Schedule){
    if(schedule)
    {
      this.isEdit = true;
      this.scheduleToEdit = schedule;
      this.hourIni = moment(schedule.hour_ini, 'HH:mm').toDate();
      this.hourFin = moment(schedule.hour_fin, 'HH:mm').toDate();
    }
  }

  public set hourIni(value: Date) 
  {
    this._hourIni = value;
  }

  public get hourIni(): Date | null
  {
    return this._hourIni;
  }

  public set hourFin(value:  Date) 
  {
    this._hourFin = value;
  }

  public get hourFin(): Date | null
  {
    return this._hourFin;
  }

  validateForm()
  {

    if(!this.hourIni || this.hourIni.toDateString().trim() == '')
    { 
      return false;
    }

    if(!this.hourFin || this.hourFin.toDateString().trim() == '')
    { 
      return false;
    }

    return true;
  }

  createSchedule() {

    if(!this.validateForm())
    {
      this._snackBar.open('Por favor llena todos los campos', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5 * 1000,
      });

      return;
    }

    let Newschedule: Schedule;
    Newschedule = {
      hour_ini: this.hourIni?moment(this.hourIni).format('HH:mm'):'',
      hour_fin: this.hourFin?moment(this.hourFin).format('HH:mm'):''
    };

    console.log(Newschedule);
    this.apiService.saveSchedule(Newschedule).subscribe({
      next: () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });
  }

  editSchedule(){
    if(!this.validateForm())
    {
      this._snackBar.open('Por favor llena todos los campos', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5 * 1000,
      });

      return;
    }

    this.scheduleToEdit.hour_ini = this.hourIni?moment(this.hourIni).format('HH:mm'):'',
    this.scheduleToEdit.hour_fin = this.hourFin?moment(this.hourFin).format('HH:mm'):'';
    
    console.log(this.scheduleToEdit);
    this.apiService.editSchedule(this.scheduleToEdit).subscribe({
      next: () => {
        this._snackBar.open('Procesado exitosamente!', 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'X', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5 * 1000,
        });
      },
    });
  }

}
