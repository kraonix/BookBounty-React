# BookBounty

BookBounty is a modern, feature-rich web application designed as a digital sanctuary for book lovers. Built with **Next.js 15 (App Router)**, it offers a premium user experience with a sleek Green/Black aesthetic, dynamic animations, and robust authentication.

## 🚀 Features

-   **Modern UI/UX**: A stunning interface featuring a custom Green (`#cae962`) and Black theme, glassmorphism effects, and smooth transitions.
-   **Hero Carousel**: An interactive, 3D-style carousel showcasing featured books with gradient overlays.
-   **Book Showcase**: Infinite scrolling book sliders with hover effects and responsive layouts.
-   **Book Details**: A dedicated, dynamic page (`/book/[id]`) for every book, featuring a 3-column layout (Cover, Info, Metadata) and action buttons.
-   **Authentication**:
    -   **Secure Login/Signup**: A unique 3D flip-card interface for switching between Login and Signup forms.
    -   **Google Auth**: One-click sign-in using Google.
    -   **Credentials Auth**: Custom email/password login with bcrypt hashing.
    -   **User Profile**: Dynamic navbar that shows a user avatar and dropdown menu (Profile, Wishlist, Logout) upon login.
-   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.

## 🛠️ Tech Stack & Architecture

This project follows a **Feature-Based Architecture** to ensure scalability and maintainability.

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: Custom CSS (Modular & Global), Tailwind CSS (for utility)
-   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Folder Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/auth/        # NextAuth and Signup API endpoints
│   ├── book/[id]/       # Dynamic Book Details page
│   ├── login/           # Authentication page
│   ├── globals.css      # Global styles and theme variables
│   └── layout.tsx       # Root layout with AuthProvider
├── features/            # Feature-based modules
│   ├── auth/            # Auth components (AuthPage, AuthProvider) and styles
│   ├── book-details/    # Book Details components and styles
│   ├── book-showcase/   # Book Slider/Card components and styles
│   ├── carousel/        # Hero Carousel components and styles
│   ├── footer/          # Footer component and styles
│   └── navbar/          # Navbar component and styles
├── lib/                 # Utility functions (MongoDB connection)
└── models/              # Mongoose models (User schema)
```

## 🏁 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd book-bounty
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
