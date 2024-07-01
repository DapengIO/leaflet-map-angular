import * as L from 'leaflet';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SearchComponent } from '../search/search.component';
import { MarkerDashboardComponent } from '../marker-dashboard/marker-dashboard.component';
import { ClusterDashboardComponent } from '../cluster-dashboard/cluster-dashboard.component';
// Plugin
import 'leaflet.markercluster';

const blueIcon = L.icon({
  iconUrl: '/assets/images/marker-icon.png',
  shadowUrl: '/assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
  popupAnchor: [1, -34],
});

const redIcon = L.icon({
  iconUrl: '/assets/images/marker-selected.png',
  shadowUrl: '/assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
  popupAnchor: [1, -34],
});

type AreaItem = {
  name: string;
  label_location: { latitude: string; longitude: string };
};

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    SearchComponent,
    ClusterDashboardComponent,
    MarkerDashboardComponent,
  ],
  template: `
    <div class="relative">
      @if(searchOptions.length>0){
      <app-search
        [options]="searchOptions"
        [disabled]="onLoading"
        (change)="handleAreaChange($event)"
        (onShowDashboard)="showClusterDashboard = $event"
      />
      } @if(showClusterDashboard){
      <div>
        @if(clusterData){
        <app-cluster-dashboard [data]="clusterData" />
        }
      </div>
      }
      <div id="mapEle" class="w-full h-screen"></div>
      @if(showMarkerDashboard){
      <div>
        <app-marker-dashboard
          [data]="markerData"
          (close)="handleMarkerDashboardClose()"
        />
      </div>
      }
    </div>
  `,
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  markerData: any;
  clusterData: any;
  selectedArea: any;
  onLoading = false;
  searchOptions = [];
  selectedMarker!: L.Marker;
  showMarkerDashboard = false;
  showClusterDashboard = true;
  markerClusterGroup!: L.MarkerClusterGroup;

  private map!: L.Map;
  private defaultLocation: L.LatLngExpression = [1.29027, 103.851959];

  constructor(private dataServ: DataService) {}

  ngOnInit(): void {
    this.initMap();
    this.getAreaList();
  }

  private initMap(): void {
    this.map = L.map('mapEle', {
      center: this.defaultLocation,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ).addTo(this.map);

    L.control
      .zoom({
        position: 'bottomleft',
      })
      .addTo(this.map);

    this.dataServ.getForecastByLatlng(1.2897, 103.8501).subscribe((data) => {
      console.log(data);
      let {
        hourly: { time, direct_radiation },
      } = data;
      data.hourly.direct_radiation = direct_radiation.filter(
        (item: number) => item > 0
      );
      this.clusterData = data;
    });
  }

  // Handle area selected
  handleAreaChange(data: any) {
    if (data.label_location) {
      const { latitude, longitude } = data.label_location;
      this.map.flyTo([latitude, longitude]);
      this.setHighlightMarker(latitude, longitude);
    }
  }

  private getAreaList() {
    this.dataServ.getLocaitons().subscribe((data: any) => {
      console.log(data);
      const { area_metadata } = data;
      this.searchOptions = area_metadata;

      const markerts = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          const count = cluster.getChildCount();
          const digits = (count + '').length;
          return L.divIcon({
            html: `<div class="relative w-10 h-10 bg-white rounded-full">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    class="text-gray-200 stroke-current"
                    stroke-width="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <!-- Progress circle -->
                  <circle
                    class="text-indigo-500  progress-ring__circle stroke-current origin-center -rotate-90"
                    stroke-width="10"
                    stroke-linecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke-dasharray="251.2" 
                    stroke-dashoffset="calc(251.2 - (251.2 * ${
                      count / area_metadata.length
                    }))"
                  ></circle>
                  <text x="50" y="54" font-size="38" text-anchor="middle" alignment-baseline="middle" class="text-white">${count}</text>
                </svg>
              </div>`,
            className: 'cluster digits-' + digits,
          });
        },
      });

      area_metadata.forEach((marker: any) => {
        markerts.addLayer(
          L.marker(
            [marker.label_location.latitude, marker.label_location.longitude],
            { icon: blueIcon }
          ).bindTooltip(marker.name)
        );

        this.map.addLayer(markerts);
      });
      markerts.on('click', (e) => {
        console.log(e);
        const {
          latlng: { lat, lng },
        } = e;
        this.setHighlightMarker(lat, lng);
        this.handleClusterMarkerClick(lat, lng);
      });
    });
  }

  handleClusterMarkerClick(lat: number, lng: number) {
    this.onLoading = true;
    this.dataServ.getForecastByLatlng(lat, lng).subscribe((data: any) => {
      const markerItem = data;
      let {
        hourly: { time, direct_radiation },
      } = markerItem;
      let radIdx = 0;
      const newTime = [];
      for (const rad of direct_radiation) {
        if (rad > 0) {
          newTime.push(time[radIdx]);
        }
        radIdx++;
      }
      markerItem.hourly.direct_radiation = direct_radiation.filter(
        (item: number) => item > 0
      );
      markerItem.hourly.time = newTime;
      markerItem.mwp = Math.max(...direct_radiation);
      markerItem.mwh =
        direct_radiation.reduce(
          (partialSum: number, a: number) => partialSum + a,
          0
        ) / 24;

      const location = this.searchOptions.filter(
        (item: any) =>
          item.label_location.latitude === lat &&
          item.label_location.longitude === lng
      );
      if (location.length > 0) {
        const [{ name }] = location;
        markerItem.name = name;
      }
      this.markerData = markerItem;
      this.onLoading = false;
      this.showMarkerDashboard = true;
    });
  }

  handleMarkerDashboardClose() {
    this.showMarkerDashboard = false;
    this.map.removeLayer(this.selectedMarker);
  }

  setHighlightMarker(lat: number, lng: number) {
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }
    this.selectedMarker = L.marker([lat, lng], { icon: redIcon })
      .addTo(this.map)
      .on('click', (e) => {
        const {
          latlng: { lat, lng },
        } = e;
        this.handleClusterMarkerClick(lat, lng);
      });
  }
}
