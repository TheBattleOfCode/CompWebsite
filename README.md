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
- MySQL 8.0+
- Node.js 16+ and npm 8.x (or pnpm 8.x)

## Running the Application

### Backend (Spring)

1. Configure your MySQL database in `application.properties`
2. Run `mvn clean install` to build the project
3. Start the Spring application with `mvn spring-boot:run`

### Frontend

1. Navigate to the frontend directory
2. Run `pnpm install` to install dependencies
3. Start the frontend with `pnpm dev`

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
