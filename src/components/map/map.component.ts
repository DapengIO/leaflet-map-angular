import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SearchComponent } from '../search/search.component';
import { ClusterDashboardComponent } from '../cluster-dashboard/cluster-dashboard.component';
import { HttpClient } from '@angular/common/http';
import { MarkerDashboardComponent } from '../marker-dashboard/marker-dashboard.component';
import { DataService } from '../../services/data.service';
import 'leaflet.markercluster';

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
      />
      } @if(!showMarkerDashboard && markerData){
      <app-cluster-dashboard [data]="markerData" />
      }
      <div id="mapEle" class="w-full h-screen"></div>
      @if(showMarkerDashboard){
      <app-marker-dashboard
        [data]="markerData"
        (close)="this.showMarkerDashboard = false"
      />
      }
    </div>
  `,
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  searchOptions = [];
  private map!: L.Map;
  markerClusterGroup!: L.MarkerClusterGroup;
  private defaultLocation: L.LatLngExpression = [1.29027, 103.851959];
  private markerList: any[] = [];
  showMarkerDashboard = false;
  onLoading = false;
  markerData: any;
  selectedArea: any;

  clusterData: any;

  constructor(private http: HttpClient, private dataServ: DataService) {}

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

    this.markerClusterGroup = L.markerClusterGroup();
    // 1.2869217712980818, 103.85448810894617
  }

  // Handle area selected
  handleAreaChange(data: any) {
    if (data.label_location) {
      this.fetchDashBoard(data);
    }
  }

  private getAreaList() {
    this.dataServ.getLocaitons().subscribe((data: any) => {
      const { api_info, area_metadata, items } = data;
      this.searchOptions = area_metadata;

      const customIcon = L.icon({
        iconUrl: '/assets/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      area_metadata.forEach((marker: any) => {
        const m = L.marker(
          [marker.label_location.latitude, marker.label_location.longitude],
          { icon: customIcon }
        )
          .addTo(this.map)
          .bindPopup(marker.name);
        this.markerClusterGroup.addLayer(m);
      });
    });
  }

  private fetchDashBoard(areaData: AreaItem) {
    const {
      name,
      label_location: { latitude, longitude },
    } = areaData;
    this.onLoading = true;
    this.dataServ
      .getForecastByLatlng(latitude, longitude)
      .subscribe((data: any) => {
        const markerItem = { ...areaData, ...data };
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
        this.addMarker(markerItem);
      });
  }

  private addMarker(data: any) {
    this.map.flyTo([data.latitude, data.longitude]);
    const sameItem = this.markerList.filter((item) => item.name === data.name);
    if (sameItem.length === 0) {
      this.markerList.push(data);

      L.circleMarker([data.latitude, data.longitude], {
        radius: 12,
      })
        .addTo(this.map)
        .bindPopup(data.name)
        .on('click', (e) => {
          this.markerData = data;
          this.showMarkerDashboard = true;
        });
    }

    this.markerData = data;
    this.onLoading = false;
  }
}
