import { Component } from '@angular/core';
import { interval } from 'rxjs';

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
  wipLimit: number =  5;

  constructor() {
    this.getPullRequests();
    this.getBuilds();
    this.getWorkInProgress();
    this.getWorkAwaitingTest();
    this.getWorkInTest();
    this.getWorkAwaitingRelease();

    interval(1000 * 120).subscribe(x => this.getWorkInProgress());
    interval(1000 * 120).subscribe(x => this.getWorkAwaitingRelease());
    interval(1000 * 120).subscribe(x => this.getWorkAwaitingTest());
    interval(1000 * 120).subscribe(x => this.getWorkInTest());
    interval(1000 * 60).subscribe(x => this.getPullRequests());
    interval(1000 * 30).subscribe(x => this.getBuilds());
  }

  getPullRequests() {
    fetch("https://dev.azure.com/ominoreg/Geronimo/_apis/git/pullrequests", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
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
    fetch("https://dev.azure.com/ominoreg/Geronimo/_apis/build/builds?maxbuildsperdefinition=1", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
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
    fetch("https://dev.azure.com/ominoreg/geronimo/geronimo%20team/_apis/wit/wiql/a6032030-2ddc-4d58-9fd0-9b0f8103d9d3", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
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
    fetch("https://dev.azure.com/ominoreg/geronimo/geronimo%20team/_apis/wit/wiql/51423a08-5d39-4e91-90eb-adec6f7b1d50", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
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
    fetch("https://dev.azure.com/ominoreg/geronimo/geronimo%20team/_apis/wit/wiql/d6b77c70-b6a9-49cc-adac-994ff6711be3", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
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
    fetch("https://dev.azure.com/ominoreg/geronimo/geronimo%20team/_apis/wit/wiql/b13b9365-2d31-4d1a-b873-e8b6dafea173", {
      headers: new Headers({
        'Authorization': 'Basic ' + 'OmJjbXhzMnR6dHB2MnJzcjRoejN6cTVuMmd5cWV4ZmZ1M3Vjd3A3NTVhb2RraWhxamI0YXE='
      })
    })
    .then(data => {
      return data.json();
    })
    .then(res => {
      this.workAwaitingRelease = res.workItems;
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
    if(build.status == 'completed') {
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
