import { AfterViewInit, Component, Input, Pipe } from '@angular/core';
import { DailyEnergyChartComponent } from '../daily-energy-chart/daily-energy-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cluster-dashboard',
  standalone: true,
  imports: [DailyEnergyChartComponent, CommonModule],
  template: `
    <div class="absolute z-999 right-20 top-20">
      <div class="grid grid-cols-2 gap-4">
        <div
          id="dashboard-assets "
          class="bg-gray-400/30 p-2 rounded-xl backdrop-blur-md"
        >
          <h5 class="text-white">Assets</h5>
          <div class="pl-3">
            <div class="text-lg text-white">{{ data?.elevation }}</div>
            <div class="text-lg text-white">
              {{ data.mwp | number }} <span class="text-2sm">MWp</span>
            </div>
          </div>
        </div>
        <div
          id="dashboard-performance"
          class="bg-gray-400/50 p-2 rounded-xl backdrop-blur-md"
        >
          <h5 class="text-white">Today's Performance</h5>
          <div class="text-2sm text-white">Last update at</div>
          <div class="pl-3">
            <div class="text-lg text-white">
              {{ data.mwh | number }} <span class="text-2sm">MWh</span>
            </div>
            <div class="text-lg text-white">
              {{ data.mwh * 0.29 | number : '1.0' }}
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
        <app-daily-energy-chart [data]="data.hourly" />
      </div>
    </div>
  `,
  styleUrl: './cluster-dashboard.component.scss',
})
export class ClusterDashboardComponent implements AfterViewInit {
  @Input() data: any;

  ngAfterViewInit(): void {}
}
