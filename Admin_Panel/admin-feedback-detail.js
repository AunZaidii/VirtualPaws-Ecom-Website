import { apiClient } from "../utils/apiClient.js";

// Get feedback ID from URL
const urlParams = new URLSearchParams(window.location.search);
const feedbackId = urlParams.get('id');

// Format date helper
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Load feedback details
async function loadFeedbackDetail() {
  const container = document.getElementById('feedback-detail-content');

  if (!feedbackId) {
    container.innerHTML = `
      <div class="error">
        <p><strong>Error:</strong> No feedback ID provided.</p>
      </div>
    `;
    return;
  }

  try {
    // Fetch all feedback and find the specific one
    const response = await apiClient.get('adminGetAllFeedback');
    const feedback = response.feedback.find(f => f.contact_id === parseInt(feedbackId));

    if (!feedback) {
      container.innerHTML = `
        <div class="error">
          <p><strong>Error:</strong> Feedback not found.</p>
        </div>
      `;
      return;
    }

    // Render feedback details
    container.innerHTML = `
      <div class="detail-container">
        <div class="detail-header">
          <div class="detail-title">Feedback #${feedback.contact_id}</div>
          <div class="detail-timestamp">Submitted on ${formatDate(feedback.created_at)}</div>
        </div>

        <div class="detail-grid">
          <div class="detail-field">
            <div class="detail-label">Customer Name</div>
            <div class="detail-value">${feedback.name || 'Not provided'}</div>
          </div>

          <div class="detail-field">
            <div class="detail-label">Email Address</div>
            <div class="detail-value">
              <a href="mailto:${feedback.email}" style="color: #7CC042; text-decoration: none;">
                ${feedback.email || 'Not provided'}
              </a>
            </div>
          </div>

          <div class="detail-field">
            <div class="detail-label">Phone Number</div>
            <div class="detail-value">
              <a href="tel:${feedback.phone}" style="color: #7CC042; text-decoration: none;">
                ${feedback.phone || 'Not provided'}
              </a>
            </div>
          </div>
        </div>

        <div class="comment-section">
          <div class="detail-label">Feedback / Comment</div>
          <div class="detail-value">${feedback.comment || 'No comment provided.'}</div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Error loading feedback:', error);
    container.innerHTML = `
      <div class="error">
        <p><strong>Error:</strong> Failed to load feedback details.</p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">${error.message}</p>
      </div>
    `;
  }
}

// Initialize
loadFeedbackDetail();
