# Security Setup

## Environment Variables

This project uses environment variables to securely store API keys and sensitive information. The hardcoded API keys have been moved to environment variables for security.

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your actual API keys:**
   - `HEYGEN_API_KEY`: Your HeyGen API key from https://app.heygen.com/
   - `PEXELS_API_KEY`: Your Pexels API key from https://www.pexels.com/api/
   - `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/
   - `YOUTUBE_API_KEY`: Your YouTube Data API key from https://console.developers.google.com/

### Security Notes

- ✅ The `.env` file is already included in `.gitignore` and will not be committed to version control
- ✅ All hardcoded API keys have been removed from the source code
- ✅ Environment variables are used throughout the application for sensitive data
- ⚠️ **Never commit API keys or secrets to version control**
- ⚠️ **Keep your `.env` file secure and don't share it publicly**

### Files Updated

The following changes were made to secure your codebase:

1. **Created `.env.example`** - Template for environment variables
2. **Updated `app/dashboard/page.tsx`** - Removed hardcoded API keys:
   - Removed hardcoded `HEYGEN_API_KEY`
   - Removed hardcoded `PEXELS_API_KEY`
   - Both now use `process.env.HEYGEN_API_KEY` and `process.env.PEXELS_API_KEY`
3. **Updated `.gitignore`** - Made env exclusions more specific to allow `.env.example`
4. **Created `.env`** - Contains the actual API keys (excluded from git)

### Verification

To verify your setup is working:

1. Ensure your `.env` file exists and contains your API keys
2. Restart your development server: `npm run dev` or `yarn dev`
3. Check that the application can access the APIs without errors

### If You Already Pushed Sensitive Data

If you previously pushed commits with hardcoded API keys:

1. **Immediately rotate/regenerate all exposed API keys** from their respective services
2. Consider using `git filter-branch` or similar tools to remove sensitive data from git history
3. Be aware that public repositories may have been indexed by search engines or security scanners

## Best Practices Going Forward

- Always use environment variables for sensitive configuration
- Use `.env.example` files to document required environment variables
- Review code for sensitive data before committing
- Consider using tools like `git-secrets` to prevent accidental commits of sensitive data 