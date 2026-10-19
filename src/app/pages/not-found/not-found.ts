import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Times } from '@primeicons/angular/times';
import { ArrowLeft } from '@primeicons/angular/arrow-left';

@Component({
  imports: [RouterLink, Times, ArrowLeft],
  selector: 'app-not-found',
  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound {}
