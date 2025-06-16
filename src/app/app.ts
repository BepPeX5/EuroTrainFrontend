import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search-train/search-train';
import { KeycloakService } from './services/keycloakservice';  // 👈 Import KeycloakService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    SearchComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'EuroTrainBE';

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.keycloakService.init();
  }
}
