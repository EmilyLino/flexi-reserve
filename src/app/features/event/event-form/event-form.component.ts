import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {Schedule} from '../../../shared/models/schedule.model';
import {Area} from '../../../shared/models/area.model';
import { ApiService } from '../../../core/services/api.service';
import { MatSnackBarModule, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Reservation } from '../../../shared/models/reservation.model';
import moment from 'moment';

@Component({
  selector: 'app-event-form',
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit{

  areas: Area[] = [];
  schedules: Schedule[] = [];
  reservation_form!: FormGroup;
  private _snackBar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef<EventFormComponent>);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private apiService: ApiService,
    private fb: FormBuilder
  ){}

  async ngOnInit() {
    this.onForm();
    await this.getAreas();
    await this.getSchedule();
  }

  getAreas()
  {
    return new Promise((resolve)=>{
      const parameters = {status: 'ACTIVE'};
      this.apiService.getAllAreas(parameters).subscribe(
        (res)=>{
          this.areas = res.data;
          resolve(true);
        }
      );
    });
  }

  getSchedule()
  {
    return new Promise((resolve)=>{
      const parameters = {status: 'ACTIVE'};
      this.apiService.getAllSchedule(parameters).subscribe(
        (res)=>{
          this.schedules = res.data;
          resolve(true);
        }
      );
    });
  }

  onForm(){
    this.reservation_form = this.fb.group({
      event_name: ['',[Validators.required]],
      area_id: ['',[Validators.required]],
      schedule_id: ['',[Validators.required]],
      event_description: [''],
      date: ['', [Validators.required]]
    });
  }

  allowDate = (d: Date | null): boolean => {
    const day = (d || new Date());
    return day > new Date();
  };
  

  createReservation()
  {
    const data = this.reservation_form.getRawValue();
    console.log(data);
    if(!this.reservation_form.valid)
    {
      this._snackBar.open('Por favor llena los campos obligatorios', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 5 * 1000,
      });

      return;
    }

    //const data = this.reservation_form.getRawValue();
    let newReservation: Reservation = {
      event_name: data.event_name,
      event_description: data.event_description,
      date: moment(data.date).format('DD/MM/YYYY'),
      area_id: data.area_id,
      schedule_id: data.schedule_id,
      user_name: sessionStorage.getItem('user_name')??''
    };
    
    console.log(newReservation);
    this.apiService.saveReservation(newReservation).subscribe({
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
