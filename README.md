# Mini Chat with OpenAI Integration

This project is a small application that allows users to authenticate and make requests to the OpenAI API using NestJS. The application includes user management, OpenAI integration, and security measures to protect user data.

## Project Requirements

### User Management
- **Registration Endpoint:** Allows users to register by providing necessary details (e.g., email, password).
- **Authentication Endpoint:** Allows users to log in and receive a JWT token for session management.

### OpenAI Integration
- **Question Endpoint:** Allows authenticated users to send questions to the OpenAI API and receive responses via Server-Sent Events (SSE). Each question and its corresponding response are stored in the database.
- **Error Handling:** Properly handles errors from the OpenAI API.

### Security
- **Data Protection:** Ensures sensitive user data is stored securely.
- **Authentication & Authorization:** Protects endpoints using JWT tokens and ensures proper access control.

## Installation and Setup

### Prerequisites
- Node.js
- yarn
- Docker (optional, for containerized environments)

### Clone the Repository
```bash
git clone https://github.com/linc-inc/mini-chat.git
cd mini-chat
```

### Install Dependencies
```bash
yarn install
```

### Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables:
```
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup
This project uses SQLite for the database.

### Running the Application
```bash
yarn run start:dev
```

### Accessing the Database
To view and manage your SQLite database, you can use TablePlus or any other SQLite database viewer.

### Endpoints Overview

#### User Management
- **POST /auth/register:** Register a new user.
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`
- **POST /auth/login:** Authenticate a user.
  - Request Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "access_token": "jwt_token" }`

#### OpenAI Integration
- **POST /openai/question:** Send a question to OpenAI and receive the response via Server-Sent Events (SSE).
  - Headers: `{ "Authorization": "Bearer jwt_token" }`
  - Request Body: `{ "question": "What is NestJS?" }`
  - Response: If streaming is chosen, the response will be handled via Server-Sent Events (SSE). Otherwise, the response of this endpoint will be the AI's response directly.
  - The question and its corresponding response will be stored in the database.

- **(Optional) GET /openai/stream:** Stream responses to the client's questions in real time via Server-Sent Events (SSE).
  - Headers: { "Authorization": "Bearer jwt_token" }
  - Response: The response from the AI will be streamed back to the client


### Security Considerations
- **Password Hashing:** Ensure passwords are hashed before storing in the database.
- **JWT Expiry:** Implement expiration for JWT tokens to enhance security.

## Discussion Points
- **Approach:** Be ready to discuss how you approached the project.
- **Tradeoffs:** Discuss any tradeoffs made due to time constraints.
- **Next Steps:** Be prepared to outline next steps for improving scalability and security.



### Miguel Notes

The next thing I would do would be.

- Create a guard at the root level of the project so that any module can make use of this guard. This guard will validate the user token if it is valid or not. 

- Create the chat module where we will store each req and resp along with the user and creation date to save all the conversations that the user has with ChatGPT.

- Then, in the chat module, what we will do is to integrate the ChatGPT API by configuring in the chat.module.ts through the nestjs own config to take the token from the environment variables.

- In the chat Service, what I would do would be to integrate the chatGPT and within the chat method, what I would do would be to query the DB per user for the context of what the user has previously asked. That context will be part of the chatGPT parameters followed by the question that the user wants to ask. 

- Finally, in the Controller of the chat module, what I would do in the POST chat() method would be to add the guard of the first point to make sure that only registered users can make use of the api by covering the method as follows:

```js
@UseGuards(JwtValidUser)
@Post()
async chat(request: string){
...
}
```

Additionally, for the errors, what I would do would be to create a wrapper that would allow me to throw from any part of the application and so this wrapper would do the validation of the type of error in three types:

```js
export abstract class AbstractError extends Error {
private readonly internalErrors: CustomResponse[];
  private readonly internalWrappedError: Error;
  private httpStatusCode: HttpStatus;

...
}
```