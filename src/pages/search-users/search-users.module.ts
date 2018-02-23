import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchUsersPage } from './search-users';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SearchUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchUsersPage),
    ComponentsModule
  ],
})
export class SearchUsersPageModule {}
