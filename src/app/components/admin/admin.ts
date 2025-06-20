import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../services/keycloakservice';
import { CommonModule } from '@angular/common'; // ✅ Importa CommonModule

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  imports: [CommonModule]
})
export class AdminComponent implements OnInit {
  nomeUtente: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    const checkInterval = setInterval(() => {
      if (this.keycloakService.isInitialized) {
        clearInterval(checkInterval);

        const isAdmin = this.keycloakService.hasRole('admin');
        this.isLoggedIn = isAdmin;

        if (!isAdmin) {
          alert("Accesso negato. Non sei un amministratore.");
          this.router.navigate(['/']);
        } else {
          this.nomeUtente = this.keycloakService.profile?.given_name || 'Admin';
        }
      }
    }, 50);

    // Slideshow
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000);
  }

  goToTrainAdmin(): void {
    this.router.navigate(['/admin/trains']);
  }

  goToBookingAdmin(): void {
    this.router.navigate(['/admin/bookings']);
  }

  logout(): void {
    this.keycloakService.logout();
  }
}



