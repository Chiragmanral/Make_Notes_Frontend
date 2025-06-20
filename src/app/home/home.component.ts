import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  userNotes : any[] = [];

  constructor(private http: HttpClient, private router: Router, private auth : AuthService) {}

  getGenerateNotes() {
    this.generateNotes = true;
    this.viewNotes = false;
  }

  getViewNotes() {
    this.generateNotes = false;
    this.viewNotes = true;
  }

  generateLink() {
    if(!this.enteredText) return;

    this.http.post<{ generatedLink : string}>("http://localhost:5000/generateLink", {
      noteText : this.enteredText,
      notePassword : this.enteredPassword,
      noteDuration : this.enteredDuration
    }, {
      headers : {
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
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
    if(!this.noteLinkCredential) return;
    
    this.http.post<{text : string, msg : string}>("http://localhost:5000/getNote", {
      noteLinkCredential : this.noteLinkCredential,
      passwordCredential : this.passwordCredential
    }, {
      headers : {
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.fetchUserNotes();
  }

  fetchUserNotes() {
    const token = localStorage.getItem('token');
    if(!token) return;

    this.http.get<{ notes : any[] }>(
      "http://localhost:5000/myNotes", 
      {
        headers : {
          Authorization : `Bearer ${token}`
        }
      }
    ).subscribe({
      next : (res) => this.userNotes = res.notes,
      error : () => console.error("failed to fetch user notes")
    });
  }

}
