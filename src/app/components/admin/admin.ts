import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../services/keycloakservice';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  imports: []
})
export class AdminComponent implements OnInit {
  constructor(private router: Router, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    // Aspetta che Keycloak sia stato inizializzato
    const checkInterval = setInterval(() => {
      if (this.keycloakService.isInitialized) {
        clearInterval(checkInterval);
        const isAdmin = this.keycloakService.hasRole('admin');
        console.log('👤 Accesso admin?', isAdmin);
        if (!isAdmin) {
          alert("Accesso negato. Non sei un amministratore.");
          this.router.navigate(['/']);
        }
      }
    }, 50); // polling ogni 50ms

    // Slideshow automatico (effetto dissolvenza tra immagini)
    const images = document.querySelectorAll<HTMLImageElement>('.background-slideshow img');
    let currentIndex = 0;
    setInterval(() => {
      images.forEach((img, i) => img.classList.remove('active'));
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 10000); // Cambia immagine ogni 6 secondi
  }

  goToTrainAdmin(): void {
    this.router.navigate(['/admin/trains']);
  }

  goToBookingAdmin(): void {
    this.router.navigate(['/admin/bookings']);
  }
}

