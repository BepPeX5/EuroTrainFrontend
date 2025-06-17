import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search-train/search-train';
import { KeycloakService } from './services/keycloakservice';

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

  async ngOnInit(): Promise<void> {
    const authenticated = await this.keycloakService.init();
    console.log('🔑 Keycloak init in AppComponent:', authenticated);
  }
}
