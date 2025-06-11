import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  generateNotes : boolean = true;
  viewNotes : boolean = false;
  noteLink : string = "";
  enteredText : string = "";
  enteredPassword : string = "";
  enteredDuration : string = "once";
  noteLinkCredential : string = "";
  passwordCredential : string = "";

  constructor(private http: HttpClient, private router: Router) {}

  getGenerateNotes() {
    this.generateNotes = true;
    this.viewNotes = false;
  }

  getViewNotes() {
    this.generateNotes = false;
    this.viewNotes = true;
  }

  generateLink() {
    this.http.post<{ generatedLink : string}>("http://localhost:5000/generateLink", {
      noteText : this.enteredText,
      notePassword : this.enteredPassword,
      noteDuration : this.enteredDuration
    })
    .subscribe({
        next: ({ generatedLink }) => {
          this.noteLink = generatedLink;
          this.enteredText = "";
          this.enteredPassword = "";
          this.enteredDuration = "once";
        },
        error: () => alert('Server error – check backend console.'),
      });
  }

  getNote() {
    this.http.post<{text : string}>("http://localhost:5000/getNote", {
      noteLinkCredential : this.noteLinkCredential,
      passwordCredential : this.passwordCredential
    })
  }
}
