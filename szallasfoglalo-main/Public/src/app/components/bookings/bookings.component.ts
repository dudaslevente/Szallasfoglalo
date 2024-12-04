import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { Booking } from '../../interfaces/booking';

import moment from 'moment';
import { Accomondation } from '../../interfaces/accomodations';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit{
  constructor(
    private api: ApiService,
    private auth: AuthService
  ){}

  loggeUser:User = {
    id: '',
    name: '',
    email: '',
    passwd: '',
    confirm: '',
    role: ''
  }

  bookings:Booking[] = [];
  accoms:Accomondation[] = [];

  ngOnInit(): void {
    this.getAccomondations();

    this.loggeUser = this.auth.loggedUser();

    this.api.select('bookings', 'userID', 'eq', this.loggeUser.id).subscribe(res => {
      this.bookings = res as Booking[];

      this.bookings.forEach(bookings => {
        bookings.bookingDate = moment(bookings.bookingDate).format('YYYY-MM-DD');
        bookings.bookingDate = moment(bookings.bookingDate).format('YYYY-MM-DD');
        bookings.bookingDate = moment(bookings.bookingDate).format('YYYY-MM-DD');

        bookings.accomName = this.accoms.find(item => item.id == bookings.accomID)!.title;
        bookings.accomAddr = this.accoms.find(item => item.id == bookings.accomID)!.address;
      })
    });
  }

  getAccomondations(){
    this.api.selectAll('accomodations').subscribe(res => {
      this.accoms = res as any[];
    });
  }
}
