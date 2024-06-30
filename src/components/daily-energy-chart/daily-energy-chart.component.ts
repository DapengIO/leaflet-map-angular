import { style } from '@angular/animations';
import { AfterViewInit, Component, Input } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-daily-energy-chart',
  standalone: true,
  imports: [],
  template: ` <div [id]="id"></div> `,
  styleUrl: './daily-energy-chart.component.scss',
})
export class DailyEnergyChartComponent implements AfterViewInit {
  @Input() id: string = 'chart';
  @Input() data: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart() {
    const options = {
      chart: {
        type: 'area',
        height: '180',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        colors: ['#3DBCC8', '#2E8D96', '#245F64', '#1A2A2D'],
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      stroke: {
        width: 1,
        curve: 'smooth',
        color: '#41C6D2',
      },
      series: [
        {
          data: this.data.direct_radiation,
        },
      ],
      xaxis: {
        categories: this.data.time.map((dt: string) => dt.split('T')[1]),
        labels: {
          style: {
            colors: '#fff',
            fontSize: '8px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#fff',
            fontSize: '8px',
            cssClass: 'apexcharts-xaxis-label',
          },
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector(`#${this.id}`),
      options
    );

    chart.render();
  }
}
