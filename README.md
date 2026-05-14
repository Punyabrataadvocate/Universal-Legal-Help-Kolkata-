# Legal Help Kolkata - Legal Awareness Platform

This project is a React-based web application for legal awareness, built with Vite, Tailwind CSS, and Firebase.

## Setup Instructions for Developers

To run this project locally or prepare it for production (e.g., Google Play Store submission via TWA/WebView), follow these steps:

### 1. Environment Configuration

The project uses environment variables to manage sensitive credentials. You must create a `.env` file in the root directory.

1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your own credentials (e.g., Firebase, Gemini API).

### 2. Available Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key for AI features. |
| `FIREBASE_API_KEY` | Your Firebase project API Key. |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID. |
| `FIREBASE_APP_ID` | Your Firebase Web App ID. |
| `FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain (e.g., project.firebaseapp.com). |
| `FIREBASE_FIRESTORE_DATABASE_ID` | The ID of your Firestore database (usually `(default)`). |
| `FIREBASE_STORAGE_BUCKET` | Your Firebase Storage bucket URL. |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID. |

### 3. Installation and Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/lib/firebase.ts`: Optimized Firebase initialization using environment variables.
- `src/pages/`: Contains all application views (Home, Directory, Blog, etc.).
- `vite.config.ts`: Configured to bridge system environment variables into the application via `process.env`.

## Security

- Hardcoded API keys have been removed from the source code.
- `.env` is included in `.gitignore` to prevent credentials from being committed to version control.
- Always keep your `.env` file private.
