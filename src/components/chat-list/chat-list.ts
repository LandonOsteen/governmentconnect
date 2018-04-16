import {Component, Input, SimpleChanges} from '@angular/core';
import {PipesModule} from '../../pipes/pipes.module';

@Component({
  selector: 'chat-list',
  templateUrl: 'chat-list.html',
  providers: [PipesModule]
})
export class ChatListComponent {

  @Input('channels') channels: Channel[] = [];
  @Input('loading') loading: boolean = true;

  maxSlice = 20;

  getNavParams(channel: Channel) {
    return {'channel': channel};
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
