import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { Label } from 'ng2-charts';
import { interval } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
})
export class LocationComponent{
  private x;
  private y;
  public x_coordinate;
  public y_coordinate;
  public valid_zone = true;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(private http: HttpClient) { }
  public scatterChartOptions: ChartOptions = {
    responsive: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Location Y'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Location X'
        }
      }]
    }
  };

  public scatterChartData: ChartDataSets[] = [
    {

      data: [
        { x: 100, y: 100 },
        { x: 0, y: 0}
      ],
      label: 'Series A',
      pointRadius: 10,
    },
  ];

  public getData(){

    this.http.get<{x: number, y: number}>('http://localhost:3000/iaas_location')
    .subscribe((responseData) =>{
      console.log('location',responseData);
      let array_len = this.scatterChartData[0].data.length
      this.scatterChartData[0].data[array_len-1]['x'] = responseData.x
      this.scatterChartData[0].data[array_len-1]['y'] = responseData.y
      this.chart.chart.update()
      if((responseData.x > 50) && (responseData.y > 50)){
        this.valid_zone = false;
      }else{
        this.valid_zone = true;
      }

    });
  }


  public addBeacons(){
    console.log(this.x_coordinate, this.y_coordinate)
    let new_beacon = {
      x: this.x_coordinate,
      y: this.y_coordinate
    };
    (this.scatterChartData[0].data as ChartPoint[]).unshift(new_beacon)
    this.chart.chart.update()
  }


  public scatterChartType: ChartType = 'scatter';

  ngOnInit() {
    interval(3000).subscribe(() => {
      this.getData();
    });
  }
}
