import { Area } from './area.model';
import { Schedule } from './schedule.model';
import { User } from './user.model';

export interface Reservation 
{
    id_event?: number;
    event_name: string;
    event_description?: string;
    area?: Area;
    area_id: number;
    schedule?: Schedule;
    schedule_id: number;
    date: string|Date;
    user?: User;
    user_id?: number;
    user_name: string
}
  