import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericRequest } from '../../shared/models/generic-request';
import { GenericResponse } from '../../shared/models/generic-response';
import { environment } from "../../../environments/environment";
import { Area } from '../../shared/models/area.model';
import { Schedule } from '../../shared/models/schedule.model';
import { Reservation } from '../../shared/models/reservation.model';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _token: any;
  private urlApi: string = environment.api_host + '/api'
  constructor(private http: HttpClient) {
    this._token = sessionStorage.getItem('token');
  }

  getAllAreas(parameters: any = null) {
    let urlParams = '';
    if(parameters && parameters.status)
    {
      urlParams += '?status='+parameters.status;
    }
    return this.http.get<GenericResponse<any>>(`${this.urlApi}/area${urlParams}`);
  }

  saveArea(data: Area)
  {
    const url = `${this.urlApi}/area`;
    return this.http.post<GenericResponse<any>>(url, data);
  }

  deleteArea(id: number)
  {
    const url = `${this.urlApi}/area/delete/${id}`;

    return this.http.post<GenericResponse<any>>(url,{});
  }

  editArea(data: Area)
  {
    const url = `${this.urlApi}/area/edit/${data.id_area}`;
    return this.http.post<GenericResponse<any>>(url, data);
  }

  getAllSchedule(parameters: any = null) {
    let urlParams = '';
    if(parameters && parameters.status)
    {
      urlParams += '?status='+parameters.status;
    }
    return this.http.get<GenericResponse<any>>(`${this.urlApi}/schedule${urlParams}`);
  }

  saveSchedule(data: Schedule)
  {
    const url = `${this.urlApi}/schedule`;

    return this.http.post<GenericResponse<any>>(url, data);
  }

  deleteSchedule(id: number)
  {
    const url = `${this.urlApi}/schedule/delete/${id}`;

    return this.http.post<GenericResponse<any>>(url ,{});
  }

  editSchedule(data: Schedule)
  {
    const url = `${this.urlApi}/schedule/edit/${data.id_schedule}`;

    return this.http.post<GenericResponse<any>>(url, data);
  }

  getAllReservation(parameters: any) {
    let urlParams = '';
    if(parameters && parameters.area_id)
    {
      urlParams += urlParams == ''? '?area_id=' :  '&area_id=';
      urlParams = urlParams +parameters.area_id;
    }

    if(parameters && parameters.user_name)
    {
      urlParams += urlParams == ''? '?user_name=': '&user_name=';
      urlParams = urlParams + parameters.user_name;
    }
    return this.http.get<GenericResponse<any>>(`${this.urlApi}/reservation${urlParams}`);
  }

  saveReservation(data: Reservation)
  {
    const url = `${this.urlApi}/reservation`;
    return this.http.post<GenericResponse<any>>(url, data);
  }

  login(data: User)
  {
    const url = `${environment.api_host}/auth`;
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    const options = { headers};
    return this.http.post<any>(url, data ,options);
  }

  register(data: User)
  {
    const url = `${environment.api_host}/register`;
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    const options = { headers};
    return this.http.post<any>(url, data ,options);
  }

}
