/*
Copyright (c) <2020> <Manish Mahesh Dalvi, M.Sc. Infomation Technology>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DisplayComponent } from './display/display.component';
import { Co2Component} from './display/co_2/co_2.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule} from '@angular/material/input'
import { MatToolbarModule} from '@angular/material/toolbar'
import { MatCardModule} from '@angular/material/card'
import { MatButtonModule} from '@angular/material/button'
import { ChartsModule } from 'ng2-charts';

import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list'

import {HttpClientModule} from '@angular/common/http'
import { LocationComponent } from './display/location/location.component';
import { TemperatureComponent } from './display/temperature/temperature.component';
import { MotionComponent } from './display/motion/motion.component';
import { EntranceComponent } from './display/entrance/entrance.component';
import { HumidityComponent } from './display/humidity/humidity.component';
import { ActuationComponent } from './display/actuation/actuation.component';

import { MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DisplayComponent,
    Co2Component,
    LocationComponent,
    TemperatureComponent,
    MotionComponent,
    EntranceComponent,
    HumidityComponent,
    ActuationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    ChartsModule,
    MatTabsModule,
    MatGridListModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
