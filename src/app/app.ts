import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search-train/search-train'; // 👈 Importa il componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    SearchComponent // 👈 Importa anche qui per montarlo nel template
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'EuroTrainBE';
}
