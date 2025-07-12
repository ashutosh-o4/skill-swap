# Skill Swap Platform - Backend API

A Spring Boot REST API for the Skill Swap Platform that connects to Firebase Firestore for data persistence.

## 🚀 Features

- **User Management**: Create, update, delete, and manage user profiles
- **Skill Matching**: Search users by skills offered/wanted and availability
- **Swap Requests**: Send, accept, reject, and manage skill swap requests
- **Rating System**: Rate and provide feedback after completed swaps
- **Profile Visibility**: Toggle between public and private profiles
- **Firebase Integration**: Full integration with Firebase Firestore

## 🛠 Tech Stack

- **Java 17**
- **Spring Boot 3.5.3**
- **Firebase Admin SDK 9.2.0**
- **Lombok**
- **Spring Validation**
- **Maven**

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Firebase project with Firestore enabled
- Firebase service account key

## 🔧 Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key (JSON file)
6. Replace the content in `src/main/resources/firebase-service-account.json` with your actual service account key

### 2. Application Configuration

Update `src/main/resources/application.properties`:

```properties
# Replace with your Firebase project ID
firebase.project-id=your-firebase-project-id
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### User Endpoints

#### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "location": "San Francisco, CA",
  "availability": ["weekends", "evenings"],
  "skillsOffered": ["React", "TypeScript"],
  "skillsWanted": ["Python", "Machine Learning"],
  "publicProfile": true,
  "about": "Frontend developer looking to learn backend"
}
```

#### Get User by ID
```http
GET /users/{id}
```

#### Update User
```http
PUT /users/{id}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "location": "New York, NY",
  "availability": ["weekends"],
  "skillsOffered": ["React", "TypeScript", "Node.js"],
  "skillsWanted": ["Python"],
  "publicProfile": true,
  "about": "Updated bio"
}
```

#### Get All Users
```http
GET /users
```

#### Search Users
```http
POST /users/search
Content-Type: application/json

{
  "searchTerm": "React",
  "skills": ["React", "TypeScript"],
  "availability": ["weekends"],
  "publicProfile": true
}
```

#### Get Users by Skill
```http
GET /users/skill/{skill}?type=offered
GET /users/skill/{skill}?type=wanted
```

#### Get Users by Availability
```http
GET /users/availability/{availability}
```

#### Toggle Profile Visibility
```http
PATCH /users/{id}/visibility?isPublic=true
```

#### Update Rating
```http
PATCH /users/{id}/rating?rating=4.5
```

#### Delete User
```http
DELETE /users/{id}
```

### Swap Request Endpoints

#### Create Swap Request
```http
POST /swaps
Content-Type: application/json

{
  "fromUserId": "user123",
  "toUserId": "user456",
  "skillOffered": "React",
  "skillWanted": "Python",
  "message": "I'd love to help you with React in exchange for Python lessons!"
}
```

#### Get Swap Request by ID
```http
GET /swaps/{id}
```

#### Get Swap Requests by From User
```http
GET /swaps/from/{fromUserId}
```

#### Get Swap Requests by To User
```http
GET /swaps/to/{toUserId}
```

#### Get Swap Requests by Status
```http
GET /swaps/user/{userId}/status/{status}
```

#### Accept Swap Request
```http
PATCH /swaps/{id}/accept
```

#### Reject Swap Request
```http
PATCH /swaps/{id}/reject
```

#### Complete Swap Request
```http
PATCH /swaps/{id}/complete
```

#### Add Rating and Feedback
```http
PATCH /swaps/{id}/rating?rating=4.5&feedback=Great experience!
```

#### Delete Swap Request
```http
DELETE /swaps/{id}
```

## 📊 Data Models

### User Model
```json
{
  "id": "string",
  "name": "string",
  "profilePhoto": "string (URL)",
  "location": "string",
  "availability": ["string"],
  "skillsOffered": ["string"],
  "skillsWanted": ["string"],
  "publicProfile": "boolean",
  "rating": "number",
  "about": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Swap Request Model
```json
{
  "id": "string",
  "fromUserId": "string",
  "toUserId": "string",
  "skillOffered": "string",
  "skillWanted": "string",
  "message": "string",
  "status": "PENDING|ACCEPTED|REJECTED|COMPLETED|CANCELLED",
  "rating": "number",
  "feedback": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🔒 Security Features

- Input validation using Bean Validation
- CORS configuration for frontend integration
- Global exception handling
- Proper HTTP status codes
- Data sanitization

## 🧪 Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn jacoco:report
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `firebase.project-id` | Firebase project ID | Required |
| `server.port` | Server port | 8080 |
| `logging.level.com.swap_skill.swapskill` | Logging level | DEBUG |

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t skill-swap-backend .

# Run container
docker run -p 8080:8080 skill-swap-backend
```

### Cloud Deployment
The application can be deployed to:
- Google Cloud Run
- AWS Elastic Beanstalk
- Heroku
- Any Java-compatible cloud platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the logs for debugging information

## 🔄 API Response Format

All API responses follow this format:

```json
{
  "success": "boolean",
  "message": "string",
  "data": "object|array|null",
  "timestamp": "datetime"
}
```

### Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user123",
    "name": "John Doe"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found with ID: user123",
  "data": null,
  "timestamp": "2024-01-15T10:30:00"
}
``` 