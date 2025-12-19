import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-snackbar',
  template: `
    <div class="snackbar-container">
      <div class="message">
        <i class="fa-solid fa-circle-check"></i>
        <span>{{ data.message }}</span>
      </div>
      <div class="progress-bar"></div>
    </div>
  `,
  styles: [`
    .snackbar-container {
      background: #198754;
      color: #fff;
      padding: 18px 20px 14px;
      border-radius: 12px;
      min-height: 64px;
      min-width: 280px;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,.9);
      margin-top: 10px;
      border-radius: 2px;
      animation: progress 3s linear forwards;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class SuccessSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
