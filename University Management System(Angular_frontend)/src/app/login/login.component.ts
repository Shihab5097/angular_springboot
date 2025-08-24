import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = { username: '', password: '' };
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    console.log('Login ??????? with', this.user);
    this.errorMessage = '';

    this.auth.login(this.user).subscribe({
      next: loggedUser => {
        console.log('? HTTP success, user:', loggedUser);
        localStorage.setItem('currentuser', loggedUser.username);
        this.router.navigate(['/home', 'dashboard']);
      },
      error: err => {
        console.error('? HTTP error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Cannot reach server. Is backend running?';
        } else if (err.status === 401) {
          this.errorMessage = 'Username or password incorrect';
        } else {
          this.errorMessage = err.error?.toString() || err.statusText;
        }
      }
    });
  }
}
