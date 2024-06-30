import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from '../components/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent],
  template: `
    <main class="main">
      <app-map />
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'leaflet-map-angular';
}
