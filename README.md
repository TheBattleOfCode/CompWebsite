# Battle Of Code

## Description

### A problem solving platform, where participant play various types of games, solving problems with coding, maths, common knowledge

### Solvers compete against each others individually or in teams to win badges, XP, and eventually cash prizes

## Roadmap

- [x] Authentication and account management

- [ ] Number gen type problem :

  - [ ] Creating
        -   [ ] add problem to DB
        -   [ ] input controls
        -   [ ] adequate text areas for in/output generators
        -   [ ] preview in/output
  - [ ] Reading
        - [ ] open problem
        - [ ] generate input/output
        - [ ] submit answer
        - [ ] affecting score

- [ ] making buttons' effect visible

- [ ] Dashboarding
  - [ ] User Dashboard (ranking(country/establishment/world), list of solved problems, ...)
  - [ ] Admin Dashboard (number of accounts, number of problems, list of problems with number of times solved (in number and %), ...)

## Prerequisites

To run this fullstack application, you need:

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 15+
- Node.js 16+ and npm 8.x (or pnpm 8.x)

## Assets

### Class Diagram

![Class diag](https://i.imgur.com/L3lJPE9.png)

### Use case Diagram

![UC diag](https://i.imgur.com/Gnjh6sD.png)

## A project by

[**Ahmed Khalil SEDDIK**](https://www.linkedin.com/in/ahmed-khalil-seddik/)

[**Houssem MOUSSA**](https://www.linkedin.com/in/houssem-moussa-aa7402188/)

[**Mohamed NEJI**](https://www.linkedin.com/in/mohamedneji/)

---

## New Start - April 15, 2025

This marks a new beginning for the Battle of Code project. The Node.js backend has been replaced with a Spring backend for improved performance and scalability. The frontend has also been refactored to use modern technologies including Redux Toolkit Query (RTKQ) for efficient API data fetching and state management, Vite as the build tool for faster development experience, PNPM for more efficient package management

## Running the Application

### What You Need to Install and Download to Run the Application

#### Backend Requirements

1. **Java Development Kit (JDK) 17 or higher**
   - The Spring backend requires Java 17 as specified in the pom.xml file
   - You can download it from [Oracle's website](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK

2. **Maven 3.8+**
   - Required to build and run the Spring backend
   - Download from [Maven's official site](https://maven.apache.org/download.cgi)
   - Make sure it's added to your PATH

3. **PostgreSQL 15 or higher**
   - The backend uses PostgreSQL as its database
   - Download from [PostgreSQL's website](https://www.postgresql.org/download/)
   - You'll need to create a database named "Comp"
   - Default credentials in the configuration are:
     - Username: root
     - Password: changeme

4. **Git**
   - To clone the repository if you haven't already

#### Frontend Requirements

1. **Node.js 16+ and npm**
   - Required to run the React frontend
   - Download from [Node.js website](https://nodejs.org/)

2. **PNPM 8.x**
   - The project uses PNPM as the package manager for the frontend
   - Install it globally using npm: `npm install -g pnpm`

### Steps to Run the Application

#### Backend Setup

1. **Configure the database**:
   - Make sure PostgreSQL is installed and running
   - Create a database named "Comp"
   - You can use the default credentials or set your own in the `.env` file

2. **Set up environment variables**:
   - Navigate to the Backend-spring directory
   - Copy the example environment file: `cp .env.example .env`
   - Edit the `.env` file with your database credentials if needed

3. **Build and run the backend**:

   ```bash
   cd Backend-spring
   mvn clean install
   mvn spring-boot:run
   ```

   - The backend will start on port 8080 by default
   - The API will be available at [http://localhost:8080/api](http://localhost:8080/api)
   - Swagger UI will be available at [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)

#### Frontend Setup

1. **Install dependencies**:

   ```bash
   cd Frontend
   pnpm install
   ```

2. **Start the development server**:

   ```bash
   pnpm dev
   ```

   - The frontend will start on port 5173 by default (Vite's default port)
   - You can access it at [http://localhost:5173](http://localhost:5173)

### Alternative: Using Docker

If you prefer to use Docker instead of installing everything locally:

1. **Install Docker and Docker Compose**
   - Download from [Docker's website](https://www.docker.com/products/docker-desktop)

2. **Run the application using Docker Compose**:

   ```bash
   # From the project root
   docker-compose -f docker-compose-local.yaml up
   ```

   - This will start both the PostgreSQL database and the application

### Troubleshooting

- If you encounter database connection issues, make sure PostgreSQL is running and the credentials in your `.env` file are correct
- For frontend issues, check that you're using the correct version of Node.js and that PNPM is installed correctly
- The Swagger UI ([http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)) can help you understand and test the available API endpoints
