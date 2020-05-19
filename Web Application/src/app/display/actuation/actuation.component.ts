import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-actuation',
  templateUrl: './actuation.component.html',
})
export class ActuationComponent{
  checked = false;
  message = {}
  constructor(private http: HttpClient){

  }
  send_actuation_cmd(cmd: {}){
    console.log(cmd)
    this.http.post<{message: string}>('http://localhost:3000/iaas_actuate',cmd).subscribe((responseData) =>{
      console.log(responseData);
    });
  }

  checkbox_clicked($event){
    console.log('checkbox_clicked')

    if(this.checked){
      this.message = {
        msg : "led_on"
      }

    }else{
      this.message = {
        msg : "led_off"
      }

    }
    this.send_actuation_cmd(this.message);
  }



}
