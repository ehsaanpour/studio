# NextN

## Description
NextN is a web application built with Next.js, designed to provide a robust and scalable platform for various functionalities. It includes features for user authentication, profile management, data handling via API routes, and AI-assisted form creation and validation.

## Features
- User Authentication (Login, Change Password)
- User Profile Management (Edit Profile, Profile Picture Upload)
- Admin Dashboard
- Dynamic Form Creation and Management
- AI-Assisted Form Creation and Validation Rule Generation
- Reservation Management
- Program Name Management
- Weekly Schedule View
- Theming (Light/Dark Mode)

## Installation
To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd nextn
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add necessary environment variables. (e.g., database connection strings, API keys for AI services, AWS S3 credentials for profile picture uploads).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:9002`.

5.  **Run Genkit development server (for AI features):**
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit server for AI-assisted functionalities.

## Usage
- Navigate to `http://localhost:9002` in your browser.
- Register or log in to access the application features.
- Explore the dashboard, admin panel, form management, and profile settings.
- Utilize AI features for creating forms and generating validation rules.

## Technologies Used
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (components based on Radix UI)
- **State Management/Data Fetching**: React Query, Firebase
- **Form Handling**: React Hook Form, Zod (for validation)
- **Authentication**: bcryptjs, js-cookie
- **AI Integration**: Genkit AI, Google AI
- **Cloud Storage**: AWS S3 (for profile picture uploads)
- **Date Handling**: date-fns, date-fns-jalali
- **Charting**: Recharts
- **UI Components**: Radix UI
- **Utilities**: clsx, tailwind-merge, lucide-react

## Contributing
Contributions are welcome! Please follow standard GitHub flow: fork the repository, create a new branch, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License
