import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { Reservation } from '../../shared/models/reservation.model';
import {
  CalendarModule, CalendarView, CalendarEvent
} from 'angular-calendar';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EventFormComponent }from './event-form/event-form.component';
import { ApiService} from '../../core/services/api.service';
import {MatSnackBarModule, 
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Area } from '../../shared/models/area.model';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CalendarModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatTableModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {

  view: CalendarView = CalendarView.Week;
  viewDate = new Date();
  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  areas: Area[] = [];
  reservations: Reservation[]=[];
  reservationsTable: Reservation[]=[];
  currentArea: number|null = null;
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['no.', 'area', 'hora_ini', 'hora_fin' ,'status'];
  
  constructor(private apiService:ApiService){}
  async ngOnInit() {
    await this.getAreas();
    await this.getReservationsByUser(sessionStorage.getItem('user_name'));
  }

  getReservationsByUser(user: string|null)
  { 
    let parameters: any = {};
    parameters.user_name = user;

    return new Promise((resolve)=>{
      this.apiService.getAllReservation(parameters).subscribe(
        (res)=>{
          console.log(res);
          this.reservationsTable = res.data;
          resolve(true);
        }
      );
    });
  }

  getReservations(area_id: number|null, user: string|null)
  { 
    let parameters: any = {};
    parameters.area_id = area_id;
    parameters.user_name = user;

    return new Promise((resolve)=>{
      this.apiService.getAllReservation(parameters).subscribe(
        (res)=>{
          console.log(res);
          this.reservations = res.data;
          resolve(true);
        }
      );
    });
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

  async getEvents()
  {
    if(this.currentArea) await this.getReservations(this.currentArea, null);

    this.reservations.forEach(reservation => {
      const hour_ini = reservation.schedule?.hour_ini;
      const hour_fin = reservation.schedule?.hour_fin;
      const fullDateStr = `${reservation.date} ${hour_ini}`; 
      const endDateStr = `${reservation.date} ${hour_fin}`;
      const momentObj = moment(fullDateStr, 'DD/MM/YYYY HH:mm');
      const momentEndObj = moment(endDateStr, 'DD/MM/YYYY HH:mm');

      console.log(momentObj.toDate());
      console.log(momentEndObj.toDate());
      this.events.push({
        start: momentObj.toDate(),
        end: momentEndObj.toDate(),
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        title: reservation.event_name
      });
    });
    this.refresh.next();
  }

  // setView(view: CalendarView) {
  //   this.view = view;
  // }

  // dayClicked({ date }: { date: moment.Moment }) {
  //   console.log('Día pulsado:', date.format('dddd D MMMM YYYY'));
  // }
  newReservation()
  {
    const dialogRef = this.dialog.open(EventFormComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if(result)
      {
        await this.getEvents();
        await this.getReservationsByUser(sessionStorage.getItem('user_name'));
      }
    });
  }

  async loadReservations()
  {
    console.log(this.currentArea);
    if(this.currentArea) 
    {
      await this.getEvents();
    }
  }

}
