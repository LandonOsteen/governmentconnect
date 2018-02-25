import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as Luxon from "luxon";

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
const week = day * 7 

@Pipe({
  name: 'since',
  pure: false
})
export class SincePipe implements PipeTransform, OnDestroy {

  timer: number;

  constructor(
    public changeDetectorRef: ChangeDetectorRef, 
    public ngZone: NgZone
  ) { }

  transform(date: string, ...args) {
    this.removeTimer()

    const sinceDate = Luxon.DateTime.fromISO(date)
    const nowDate = Luxon.DateTime.local()
    const duration = Luxon.Interval.fromDateTimes(sinceDate, nowDate).length()

		this.timer = this.ngZone.runOutsideAngular(() => {
      return setTimeout(() => {
        this.ngZone.run(() => this.changeDetectorRef.markForCheck());
      }, this.timeTillUpdate(duration));
		});

    if (duration >= week) {
      return `${Math.floor(duration / week)}w`
    } else if (duration >= day) {
      return `${Math.floor(duration / day)}d`
    } else if (duration >= hour) {
      return `${Math.floor(duration / hour)}h`
    } else if (duration >= minute) {
      return `${Math.floor(duration / minute)}m`
    } else if (duration >= second) {
      return `${Math.floor(duration / second)}s`
    } else {
      return 'now'
    }
  }

  private removeTimer(): void {
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}
  }
  
  ngOnDestroy() {
    this.removeTimer()
  }

	private timeTillUpdate(duration: number) {
		if (duration < minute) { 
			return second;
		} else if (duration < hour) { 
			return minute;
		} else if (duration < day) {
			return hour;
		} else { 
			return hour;
		}
	}
}
