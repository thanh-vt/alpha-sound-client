import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLoaderComponent } from './app-loader.component';
import { AppLoaderService } from './app-loader.service';

@NgModule({
  declarations: [AppLoaderComponent],
  imports: [CommonModule],
  providers: [AppLoaderService],
  exports: [AppLoaderComponent]
})
export class AppLoaderModule {}
