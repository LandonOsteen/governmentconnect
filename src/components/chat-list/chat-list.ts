import {Component, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'chat-list',
  templateUrl: 'chat-list.html'
})
export class ChatListComponent {

  @Input('channels') channels: Channel[] = [];
  @Input('loading') loading: boolean = false;

  maxSlice = 20;

  getNavParams(channel: Channel) {
    return {userId: channel.uid};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.users) {
      this.maxSlice = 20;
    }
  }

  doInfinite(infiniteScroll) {
    this.maxSlice = this.maxSlice + 20;

    infiniteScroll.complete();
  }

}
