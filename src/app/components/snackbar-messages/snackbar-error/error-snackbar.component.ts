import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snackbar',
  template: `
    <div class="snackbar-container error">
      <div class="message">
        <i class="fa-solid fa-circle-xmark"></i>
        <span>{{ data.message }}</span>
      </div>
      <div class="progress-bar"></div>
    </div>
  `,
  styles: [`
    .snackbar-container {
      background: #dc3545;
      color: #fff;
      padding: 14px 16px 8px;
      border-radius: 12px;
      min-width: 280px;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,.9);
      margin-top: 10px;
      border-radius: 2px;
      animation: progress 4s linear forwards;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ErrorSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
