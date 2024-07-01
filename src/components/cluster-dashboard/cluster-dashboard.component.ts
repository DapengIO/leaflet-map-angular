import { Component, Input } from '@angular/core';
import { DailyEnergyChartComponent } from '../daily-energy-chart/daily-energy-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cluster-dashboard',
  standalone: true,
  imports: [DailyEnergyChartComponent, CommonModule],
  template: `
    <div id="cluster-dashboard" class="absolute z-999 md:right-20 top-20">
      <div class="grid md:grid-cols-2 gap-4">
        <div
          id="dashboard-assets "
          class="bg-gray-400/30 p-2 rounded-xl backdrop-blur-md max-[480px]:flex max-[480px]:justify-around max-[480px]:items-center"
        >
          <h5 class="text-white">Assets</h5>
          <div class="md:pl-3 text-lg text-white">1452</div>
          <div class="md:pl-3 text-lg text-white">
            {{ 1461.23 | number }} <span class="text-2sm">MWp</span>
          </div>
        </div>
        <div
          id="dashboard-performance"
          class="bg-gray-400/50 p-2 rounded-xl backdrop-blur-md"
        >
          <div
            class="max-[480px]:flex max-[480px]:justify-between max-[480px]:items-center"
          >
            <h5 class="text-white">Today's Performance</h5>
            <div class="text-2sm text-white">Last update at: 2024-04-23</div>
          </div>
          <div
            class="pl-3 max-[480px]:flex max-[480px]:justify-around max-[480px]:items-center"
          >
            <div class="text-lg text-white">
              {{ 1463.23 | number }} <span class="text-2sm">MWh</span>
            </div>
            <div class="text-lg text-white">
              {{ 23 | number : '1.0' }}
              <span class="text-2sm">MW</span>
            </div>
          </div>
        </div>
      </div>
      <div
        id="dashboard-chart"
        class="bg-gray-400/30 p-2 rounded-xl backdrop-blur-md mt-4"
      >
        <h5 class="text-white">Daily Energy Generated</h5>
        <app-daily-energy-chart [id]="'cluster-chart'" [data]="data.hourly" />
      </div>
    </div>
  `,
  styleUrl: './cluster-dashboard.component.scss',
})
export class ClusterDashboardComponent {
  @Input() data: any;
}
