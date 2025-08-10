import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  generateNotes: boolean = true;
  viewNotes: boolean = false;
  noteLink: string = "";
  enteredText: string = "";
  enteredPassword: string = "";
  enteredDuration: string = "once";
  noteLinkCredential: string = "";
  passwordCredential: string = "";
  noteText: string = "";
  noteMsg: string = "";
  userNotes: any[] = [];

  ngOnInit() {
    this.fetchUserNotes();
  }

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  getGenerateNotes() {
    this.generateNotes = true;
    this.viewNotes = false;
  }

  getViewNotes() {
    this.generateNotes = false;
    this.viewNotes = true;
  }

  generateLink() {
    if (!this.enteredText) return;

    this.http.post<{ generatedLink: string }>("http://localhost:5000/generateLink", {
      noteText: this.enteredText,
      notePassword: this.enteredPassword,
      noteDuration: this.enteredDuration
    })
      .subscribe({
        next: ({ generatedLink }) => {
          this.noteLink = generatedLink;
          this.enteredText = "";
          this.enteredPassword = "";
          this.enteredDuration = "once";
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            alert("Your token or session is expired!! Login again")
          }
          else {
            alert('Server error – check backend console.')
          }
        }
      });
  }

  getNote() {
    if (!this.noteLinkCredential) return;

    this.http.post<{ text: string, msg: string }>("http://localhost:5000/getNote", {
      noteLinkCredential: this.noteLinkCredential,
      passwordCredential: this.passwordCredential
    })
      .subscribe({
        next: ({ text, msg }) => {
          this.noteText = text;
          this.noteMsg = msg;
          this.noteLinkCredential = "";
          this.passwordCredential = "";
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 403) {
            alert("Your token or session is expired!! Login again")
          }
          else {
            alert('Server error – check backend console.')
          }
        }
      });
  }

  logout() {
    this.auth.logout();
  }

  fetchUserNotes() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    this.http.get<{ notes: any[] }>(
      "http://localhost:5000/myNotes",
    ).subscribe({
      next: (res) => this.userNotes = res.notes,
      error: () => console.error("failed to fetch user notes")
    });
  }

  copyLink(noteUrl: string) {
    navigator.clipboard.writeText(noteUrl).then(() => {
      console.log("Your link is copied to the clipboard!!");
    }).catch(() => {
      alert("Failed to copy link");
    });
  }

  viewNote(noteUrl: string) {
    this.http.post<{ text?: string; isPassword?: string }>(
      "http://localhost:5000/viewMyNote",
      { noteUrl }
    ).subscribe({
      next: ({ text, isPassword }) => {
        if (text && isPassword) {
          alert(`Your note is :- ${text} and the password status is :- ${isPassword}`);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          alert("Your token or session is expired!! Login again");
        } else {
          alert("Server error – check backend console.");
        }
      }
    });
  }

  deleteNote(noteUrl: string) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    this.http.post<{ deleted: boolean }>(
      "http://localhost:5000/deleteNote",
      { noteUrl } // FIX: Send directly
    ).subscribe({
      next: (res) => {
        if (res.deleted) {
          alert("Deleted the note successfully!!");
          this.fetchUserNotes(); // Refresh notes list
        } else {
          alert("Note is not deleted, there is some issue in deleting the note");
        }
      },
      error: () => {
        console.log("Server error - check backend console");
      }
    });
  }
}
