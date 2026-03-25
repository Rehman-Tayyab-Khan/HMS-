/**
 * Production environment configuration
 * 
 * IMPORTANT: Before deploying to production, update the apiUrl with your actual production API URL.
 * 
 * Example:
 * - If your API is at https://api.yourdomain.com, set apiUrl to 'https://api.yourdomain.com/api'
 * - Ensure CORS is properly configured on the backend to allow requests from your frontend domain
 * - Use HTTPS in production for security
 */
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api' // TODO: Replace with actual production API URL
};
