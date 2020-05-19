import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
})
export class MotionComponent{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(private http: HttpClient) { }

  motion = "-"
  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    fill: false
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
    this.http.get<{motion: string}>('http://localhost:3000/iaas_motion')
    .subscribe((responseData) =>{
      console.log('motion',responseData.motion[0]);
      this.motion = responseData.motion[0];
    //   this.barChartData[0].data.unshift(responseData.x);
    //   this.barChartData[0].data.pop();
    //   console.log(this.barChartData[0].data);
    //   this.chart.chart.update()
    });

  }



  ngOnInit() {

    interval(3000).subscribe(() => {
      this.getData();
    });

  }
}
