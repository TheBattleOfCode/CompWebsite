# Competition Website Backend with Spring Boot

This is the backend for the Competition Website, built with Spring Boot, PostgreSQL, and JWT authentication.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Profiles](#profiles)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Docker](#docker)
- [API Documentation](#api-documentation)

## Environment Setup

The application uses environment variables for configuration. Follow these steps to set up your environment:

1. Copy the example environment file to create your own:

```bash
cp .env.example .env
```

2. Edit the `.env` file with your specific configuration values:

```properties
# Server Configuration
SERVER_PORT=8080
SERVER_CONTEXT_PATH=/api

# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/Comp
DB_USERNAME=root
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Logging Configuration
LOG_LEVEL_SPRING_SECURITY=INFO
LOG_LEVEL_APP=INFO
LOG_LEVEL_LIQUIBASE=INFO
```

> **Note**: For production environments, make sure to use strong, unique values for passwords and secrets.

## Profiles

The application supports different profiles for various environments:

### Local Profile

The local profile is intended for local development:

- Uses default values from `.env` file with fallbacks
- Enables detailed SQL logging
- Enables debug-level logging

To run with the local profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Dev Profile

The dev profile is intended for shared development environments:

- Requires all environment variables to be set
- Uses more conservative logging settings
- Suitable for team development environments

To run with the dev profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Running the Application

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 15 or higher

### Steps

1. Ensure PostgreSQL is running and the database is created:

```bash
# Create the database if it doesn't exist
createdb Comp
```

2. Run the application:

```bash
# Using Maven
mvn spring-boot:run

# Or with a specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

3. The application will be available at `http://localhost:8080/api`

## Testing

The project includes both unit tests and integration tests.

### Running Unit Tests

Unit tests use the H2 in-memory database and don't require any external dependencies:

```bash
# Run only unit tests
mvn test

# Or with the unit-test profile
mvn test -P unit-test
```

### Running Integration Tests

Integration tests use TestContainers to spin up a PostgreSQL container:

```bash
# Run only integration tests
mvn verify -P integration-test
```

### Running All Tests

To run both unit and integration tests:

```bash
mvn verify
```

## Docker

The application can be run using Docker and Docker Compose.

### Building and Running with Docker Compose

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the containers
docker-compose down
```

### Environment Variables in Docker

Docker Compose will use the `.env` file for environment variables. You can override them by setting them in your environment or in the docker-compose.yml file.

## API Documentation

The API documentation is available through Swagger UI when the application is running:

- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI Spec: `http://localhost:8080/api/api-docs`

## Project Structure

```
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.comp.web
│   │   │       ├── config        # Configuration classes
│   │   │       ├── controller    # REST controllers
│   │   │       ├── exception     # Exception handlers
│   │   │       ├── model         # Entity and DTO classes
│   │   │       ├── repository    # Data repositories
│   │   │       ├── security      # Security configuration
│   │   │       └── service       # Business logic
│   │   └── resources
│   │       ├── application.properties          # Common properties
│   │       ├── application-local.properties    # Local profile
│   │       ├── application-dev.properties      # Dev profile
│   │       └── db/changelog                    # Liquibase migrations
│   └── test
│       ├── java                  # Test classes
│       └── resources
│           └── application-test.properties  # Test configuration
├── .env.example                  # Example environment variables
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker build configuration
└── pom.xml                       # Maven configuration
```
