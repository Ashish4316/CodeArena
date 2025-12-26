# 🎯 CodeArena

CodeArena is a comprehensive platform designed for developers to track their Data Structures and Algorithms (DSA) progress, manage personalized question sheets, and visualize their journey towards mastering technical interviews.

## 🚀 Features

-   **DSA Sheets Integration**: Access popular sheets like Striver SDE, A2Z, and Love Babbar directly within the platform.
-   **Custom Sheet Creation**: Create and manage your own personalized question sheets tailored to your goals.
-   **Interactive Dashboard**: Visualize your progress with dynamic charts, activity maps, and achievement tracking.
-   **Company-Specific Prep**: Filter and focus on questions frequently asked by top tech companies.
-   **Real-time Synchronization**: Tracks your solved questions across different devices using Firebase.
-   **Smooth UI/UX**: Optimized performance with GSAP animations and a premium, responsive design.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS 4
-   **State Management**: React Context API
-   **Backend/Database**: Firebase (Firestore, Authentication)
-   **Animations**: GSAP, Lottie-react
-   **Routing**: React Router Dom v7

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Ashish4316/netflix-gpt.git
    cd netflix-gpt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add your Firebase configurations:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🏗️ Project Structure

-   `src/components`: Reusable UI components (Dashboard, Navbar, Achievement, etc.)
-   `src/pages`: Main application pages (Home, SheetsList, Profile, CreateSheet, etc.)
-   `src/data`: Static and dynamic question data for various DSA sheets.
-   `src/context`: Authentication and global state management.
-   `src/utils`: Helper functions and custom hooks for data processing.

## 📄 License

This project is for educational purposes. All rights reserved.

