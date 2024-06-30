import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import * as LeafLetMap from 'leaflet';
import { DailyEnergyChartComponent } from '../daily-energy-chart/daily-energy-chart.component';

@Component({
  selector: 'app-marker-dashboard',
  standalone: true,
  imports: [DailyEnergyChartComponent],
  template: `
    <div
      class="absolute w-full h-screen flex justify-center items-center z-999 top-0"
    >
      <div
        id="marker-dashboard"
        class="flex rounded-2xl overflow-hidden backdrop-blur-sm max-w-screen-lg"
      >
        <div class="bg-gray-700/50 p-4">
          <h3>Dashboards</h3>
          <ul>
            @for(menu of dashboardMenu; track menu){
            <li class="py-2 flex items-center whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              {{ menu }}
            </li>
            }
          </ul>
        </div>
        <div class="bg-white/50 p-4">
          <div class="flex justify-between items-center mb-4">
            <h3>{{ data.name }}</h3>

            <button
              class="bg-gray-500/30 p-1 rounded-full font-bold"
              (click)="this.close.emit()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <div class="col-span-2 bg-gray-700/70 py-2 px-4 rounded-2xl">
              <h5 class="text-xl">Assets</h5>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-white">
                  <h6>Capacity</h6>
                  <div>
                    97
                    <span class="text-xs">MWp</span>
                  </div>
                </div>
                <div class="text-white">
                  <h6>Irradiance</h6>
                  <div>
                    97
                    <span class="text-xs">kW/m<sup>2</sup></span>
                  </div>
                </div>
                <div class="text-white">
                  <h6>Plant Matrix</h6>
                  <div class="text-xs">INV X SCB</div>
                  <div>28*24</div>
                </div>
                <div class="text-white">
                  <h6>Days Online</h6>
                  <div>
                    2349
                    <span class="text-xs">Days</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-700/70 py-2 px-4 rounded-2xl">
              <h5 class="text-xl">Today's Performance</h5>
              <div class="mt-4">
                <div class="text-white">
                  <h6>Performance Ratio</h6>
                  <div>
                    97
                    <span class="text-xs">%</span>
                  </div>
                </div>
                <div class="text-white">
                  <h6>Inverter Efficiency</h6>
                  <div>
                    97
                    <span class="text-xs">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-700/70 rounded-2xl overflow-hidden">
              <div id="marker-map" class="w-full h-full"></div>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-3 mt-4">
            <div class="bg-gray-700/70 py-2 px-4 rounded-2xl">
              <h5>Today's Generation</h5>
              <svg
                width="160"
                height="160"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style="transform:rotate(-90deg)"
              >
                <circle
                  r="60"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  stroke="#e0e0e0"
                  stroke-width="16px"
                  stroke-dasharray="565.48px"
                  stroke-dashoffset="0"
                ></circle>
                <circle
                  r="60"
                  cx="80"
                  cy="80"
                  stroke="#2da6f0"
                  stroke-width="16px"
                  stroke-linecap="round"
                  stroke-dashoffset="118.692px"
                  fill="transparent"
                  stroke-dasharray="565.48px"
                ></circle>
                <text
                  x="42px"
                  y="120px"
                  fill="#ffffff"
                  font-size="16px"
                  font-weight="bold"
                  style="transform:rotate(90deg) translate(0px, -196px)"
                >
                  445 MWh
                </text>
              </svg>
            </div>
            <div class="col-span-3 bg-gray-700/70 py-2 px-4 rounded-2xl">
              <h5>Irradiation Timeseries</h5>
              <app-daily-energy-chart [data]="data.hourly" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './marker-dashboard.component.scss',
})
export class MarkerDashboardComponent implements AfterViewInit {
  @Input() data: any;
  @Output() close = new EventEmitter();

  private miniMap!: LeafLetMap.Map;

  dashboardMenu = [
    'Inverter Efficiency',
    'String Performance',
    'Power Curve',
    'Soiling Loss',
    'Clipping Loss',
  ];

  ngAfterViewInit(): void {
    this.initMiniMap();
  }

  private initMiniMap(): void {
    this.miniMap = LeafLetMap.map('marker-map', {
      center: [this.data.latitude, this.data.longitude],
      zoom: 14,
      zoomControl: false,
    });

    LeafLetMap.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ).addTo(this.miniMap);
  }
}
