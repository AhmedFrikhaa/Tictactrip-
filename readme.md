# Text Justification API in Node.js with TypeScript

## Project Overview
This project implements a REST API that justifies text to 80 characters per line. The API provides token-based authentication and enforces a rate limit on the number of words a user can justify in a single day.

### Features:
- **Text Justification:** Justifies input text so that each line is exactly 80 characters.
- **Token-based Authentication:** Users must generate a token to access the text justification service.
- **Rate Limiting:** Each token is limited to justifying up to 80,000 words per day.
- **Node.js + TypeScript:** The API is built using Node.js without any frameworks (e.g., Express).
- **Testing:** Includes test coverage using Jest for ensuring functionality.

---

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/tictactrip-text-justify.git
    cd tictactrip-text-justify
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Running the Project

1. To run the server locally, use the following command:

    ```bash
    npm start
    ```

   The server will start at `http://localhost:3000`.

---

## API Endpoints

### 1. **Generate Token**
   - **Endpoint:** `/api/token`
   - **Method:** `POST`
   - **Request Body (JSON):**
     ```json
     {
       "email": "foo@bar.com"
     }
     ```
   - **Response (JSON):**
     ```json
     {
       "token": "your_generated_token"
     }
     ```

### 2. **Justify Text**
   - **Endpoint:** `/api/justify`
   - **Method:** `POST`
   - **Headers:**
     - `Authorization: Bearer your_generated_token`
     - `Content-Type: text/plain`
   - **Body (Text):** 
     ```plaintext
     Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte...
     ```
   - **Response (Justified Text):**
     ```plaintext
     Longtemps,  je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,
     mes  yeux  se  fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.»
     ```

---

## Testing

This project includes tests to ensure the proper functioning of the token generation, rate limiting, and text justification.

### Running Tests

To run the test suite, use the following command:

```bash
npm run test
