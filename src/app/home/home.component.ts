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
  noteText : string = "";
  noteMsg : string = "";

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
    this.http.post<{ generatedLink : string}>("https://make-notes-backend.onrender.com/generateLink", {
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
    this.http.post<{text : string, msg : string}>("https://make-notes-backend.onrender.com/getNote", {
      noteLinkCredential : this.noteLinkCredential,
      passwordCredential : this.passwordCredential
    })
    .subscribe({
        next: ({ text, msg }) => {
          this.noteText = text;
          this.noteMsg = msg;
          this.noteLinkCredential = "";
          this.passwordCredential = "";
        },
        error: () => alert('Server error – check backend console.'),
      });
  }

  copyLink() {
    navigator.clipboard.writeText(this.noteLink).then(() => {
      console.log("Your link is copied to the clipboard!!");
    }).catch(() => {
      alert("Failed to copy link");
    });
  }

}
