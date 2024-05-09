import { Component, OnInit, inject } from '@angular/core';
import { AgoraService } from './services/agora.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';

  ngOnInit(): void {
  }

 agoraService = inject(AgoraService)
}
