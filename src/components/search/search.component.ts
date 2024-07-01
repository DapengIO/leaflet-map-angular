import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="absolute z-999 w-full flex justify-center items-center top-5">
      <div
        class="bg-gray-300/50 py-1 w-full md:w-1/3 flex justify-center items-center rounded-full"
      >
        <form
          [formGroup]="searchForm"
          (ngSubmit)="this.change.emit(selectedOption)"
          class="w-2/3 relative text-gray-600 flex items-center"
        >
          <input
            class="w-full border-1 border-gray-300 bg-black h-8 px-5 rounded-full text-sm focus:outline-none bg-opacity-30 placeholder-white/60 text-white"
            type="search"
            placeholder="Search"
            formControlName="name"
            (input)="onSearchInput($event)"
          />
          <button type="submit" class="-ml-8" [disabled]="disabled">
            @if(disabled){
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            }@else{
            <svg
              class="text-white h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              style="enable-background: new 0 0 56.966 56.966"
              xml:space="preserve"
              width="512px"
              height="512px"
            >
              <path
                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
              />
            </svg>
            }
          </button>
          @if(showAreaList){
          <div class="absolute max-h-64 w-full  overflow-y-auto top-9">
            @for(area of this.areaList; track area){
            <div
              class="text-white px-4 py-1 cursor-pointer bg-gray-700/50 hover:bg-gray-500 text-sm"
              (click)="onSelectArea(area)"
            >
              {{ area.name }}
            </div>
            }
          </div>
          }
        </form>
        <button class="ml-4 md:hidden" (click)="handleDashboardVisiable()">
          @if(showDashboard){
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-white"
          >
            <path
              fill-rule="evenodd"
              d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
              clip-rule="evenodd"
            />
          </svg>
          }@else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
          }
        </button>
      </div>
    </div>
  `,
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Input() options: any[] = [];
  @Input() disabled: boolean = false;
  @Output() change = new EventEmitter<any>();
  @Output() onShowDashboard = new EventEmitter<any>();

  areaList: any[] = [];
  showAreaList = false;
  selectedOption: any;
  showDashboard = true;

  filteredOptions!: Observable<string[]>;

  searchForm = this.formBuilder.group(
    {
      name: '',
    },
    { disabled: this.disabled }
  );

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      console.log('click inside');
    } else {
      console.log('click outside');
      this.showAreaList = false;
    }
  }

  constructor(private formBuilder: FormBuilder, private eRef: ElementRef) {}

  ngOnInit() {
    this.areaList = JSON.parse(JSON.stringify(this.options));
  }

  onSearchInput(event: Event) {
    this.showAreaList = true;
    const newValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Perform actions based on the new value
    this.areaList = this.options.filter((option) =>
      option.name.toLowerCase().includes(newValue)
    );
  }

  onSelectArea(area: any) {
    const { name } = area;
    this.selectedOption = area;
    this.searchForm.setValue({ name });
    this.showAreaList = false;
  }

  handleDashboardVisiable() {
    this.showDashboard = !this.showDashboard;
    this.onShowDashboard?.emit(this.showDashboard);
  }
}
