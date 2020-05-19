import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { Chart } from 'chart.js'
@Component({
  selector: 'app-co_2',
  templateUrl: './co_2.component.html',
})
export class Co2Component{
 @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(private http: HttpClient) { }




  public barChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'CO 2 level'
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
    this.http.get<{co2: number}>('http://localhost:3000/iaas_co2')
    .subscribe((responseData) =>{
      console.log('co2',responseData.co2[0]);
      this.barChartData[0].data.unshift(responseData.co2[0]);
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
