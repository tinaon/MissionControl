import { Component } from '@angular/core';
import { interval } from 'rxjs';

import config from '../../missioncontrol.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pullRequests: Array<any>;
  builds:Array<any>;
  workInProgress: Array<any>;
  workAwaitingTest: Array<any>;
  workInTest: Array<any>;
  workAwaitingRelease: Array<any>;
  workAwaitingPandas: Array<any>;
  wipLimit: number =  5;

  constructor() {
    this.getPullRequests();
    this.getBuilds();
    this.getWorkInProgress();
    this.getWorkAwaitingTest();
    this.getWorkInTest();
    this.getWorkAwaitingRelease();
    this.getWorkAwaitingPandas();

    interval(1000 * 120).subscribe(x => this.getWorkInProgress());
    interval(1000 * 120).subscribe(x => this.getWorkAwaitingRelease());
    interval(1000 * 120).subscribe(x => this.getWorkAwaitingTest());
    interval(1000 * 120).subscribe(x => this.getWorkInTest());
    interval(1000 * 120).subscribe(x => this.getWorkAwaitingPandas());
    interval(1000 * 60).subscribe(x => this.getPullRequests());
    interval(1000 * 30).subscribe(x => this.getBuilds());
  }

  getPullRequests() {
    fetch(config.queries.pullRequests, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.pullRequests = res.value;
    });
  }

  getBuilds()
  {
    fetch(config.queries.builds, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.builds = res.value;
    });
  }

  getWorkInProgress()
  {
    fetch(config.queries.workInProgress, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workInProgress = res.workItems;
    });
  }

  getWorkAwaitingTest()
  {
    fetch(config.queries.workAwaitingTest, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workAwaitingTest = res.workItems;
    });
  }

  getWorkInTest()
  {
    fetch(config.queries.workInTest, {
      headers: new Headers({
        'Authorization': 'Basic '+ config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workInTest = res.workItems;
    });
  }

  getWorkAwaitingRelease()
  {
    fetch(config.queries.workAwaitingRelease, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workAwaitingRelease = res.workItems;
    });
  }

  getWorkAwaitingPandas()
  {
    fetch(config.queries.workAwaitingPandas, {
      headers: new Headers({
        'Authorization': 'Basic ' + config.pacCode
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workAwaitingPandas = res.workItems;
    });
  }

  getAgeOfPullRequest(pullRequest: any): number {
    return Math.round(Math.abs(new Date().getTime() - new Date(pullRequest.creationDate).getTime()) / 36e5);
  }

  getRunningBuilds(){
    return this.builds.filter(x => x.status != 'completed');
  }

  getNumberOfRunningBuilds(){
    return this.builds.filter(x => x.status != 'completed').length;
  }

  getBuildStatusColour(build:any){
    if(build.status == 'completed' && build.result != 'failed') {
      return 'limegreen'
    }

    if(build.status == 'inProgress') {
      return 'orange'
    }

    return 'red';
  }

  getwipColor() {
    if(this.workInProgress.length == this.wipLimit)
    {
      return 'orange'
    }

    if(this.workInProgress.length > this.wipLimit)
    {
      return 'red'
    }

    return 'white'
  }

  awaitingReviewer(request:any){
    return request.reviewers.filter(x => x.vote != 0 && x.vote != 10).length > 0;
  }

  approved(request:any){
    return request.reviewers.filter(x => x.vote == 10).length > 0 && request.reviewers.filter(x => x.vote == -5).length == 0;
  }

  navigate(url:string) {
    window.open(url, '_blank');
  }
}
