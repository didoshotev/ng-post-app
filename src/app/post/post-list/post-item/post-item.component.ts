import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core'

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input() postItem; 
  @Input() index;

  constructor() { }

  ngOnInit(): void {
  }

  onReadMore(){
    
  }
}
