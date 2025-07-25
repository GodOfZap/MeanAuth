import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './app/components/home/home.component';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-root',
    standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('frontend');
}
