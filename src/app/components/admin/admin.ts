import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  imports: []
})
export class AdminComponent {
  constructor(private router: Router) {}

  goToTrainAdmin(): void {
    this.router.navigate(['/admin/trains']);
  }

  goToBookingAdmin(): void {
    this.router.navigate(['/admin/bookings']);
  }
}
