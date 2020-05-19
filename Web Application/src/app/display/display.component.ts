import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label } from 'ng2-charts';
import { Chart, ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { interval } from 'rxjs';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {


}
