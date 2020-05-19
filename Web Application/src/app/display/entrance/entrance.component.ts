import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
})
export class EntranceComponent{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(private http: HttpClient) { }
  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    fill: false,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number of people in room'
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time'
        }
      }]
    }
  };
  public barChartLabels = ['current', '1min', '2min', '3min', '4min', '5min', '6min'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A',"fill":false,"borderColor":"rgb(75, 192, 192)","lineTension":0, "pointBackgroundColor": "rgb(0, 0, 0)"}
  ];
  data = null;

  public getData(){
    console.log('get data');
    this.http.get<{number_of_people: number}>('http://localhost:3000/iaas_entrance')
    .subscribe((responseData) =>{
      console.log('number_of_people',responseData.number_of_people[0]);
      this.barChartData[0].data.unshift(responseData.number_of_people[0]);
      this.barChartData[0].data.pop();
      console.log(this.barChartData[0].data);
      this.chart.chart.update()
    });

  }



  ngOnInit() {

    interval(3000).subscribe(() => {
      this.getData();
    });

  }
}
