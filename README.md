<h1>SwiftRide – Bike Rental Application</h1>

SwiftRide is a modern, scalable, and cloud-native web application designed to streamline the process 
of renting bikes. The application provides users with a simple, user-friendly interface to browse, book, and manage bike rentals while 
offering backend operators and admins a robust system to manage inventory, bookings, and transactions.
________________________________________________________________________________________________________________________________________

<h3>Project Objective</h3>

The primary goal of SwiftRide is to build a full-stack web application that:

•	Allows users to browse available bikes with filters for price, location, and features.

•	Supports rental bookings, document verification, and QR-based advance payment.

•	Provides an admin dashboard for tracking inventory, reservations, and approvals.

•	Ensures scalability, portability, and security through DevOps practices and cloud infrastructure.
____________________________________________________________________________________________________________________________________________
<h3>Project Modules and Flow</h3>

<h4>1. Development</h4>
   
   •	Implements full-stack development of user and admin portals.
   
   •	Provides REST APIs for bike management, bookings, authentication, and document verification.
   
   •	Uses React.js for the frontend and Node.js + Express.js for the backend.

<h4>2. Containerization</h4>
   
   •	Containerizes the entire application using Docker, ensuring portability and consistency across development, testing, and deployment environments.
   
   •	Docker images are used in both local testing and CI/CD pipelines.

<h4>3. CI/CD with Jenkins</h4>
   
   •	Configures Jenkins pipelines to automatically build Docker images, run test suites, and report results back to GitHub.
   
   •	GitHub webhooks trigger Jenkins whenever a feature branch is pushed or a pull request is raised.
   
   •	The CI/CD pipeline ensures that functionality, scalability, and reliability are validated before code merges, maintaining high-quality standards.

<h4>4. Cloud Deployment</h4>
   
   •	Deploys the application on Render, which automatically builds Docker images and handles deployment.
   
   •	Eliminates the need for manual Kubernetes setup while providing managed cloud hosting, continuous deployment, and easy updates.

<h4>5. Testing & Validation</h4>
   
   •	Performs end-to-end testing triggered via GitHub → Jenkins → Docker workflow.
   
   •	Jenkins builds a Docker testing image, executes the test suite, and reports the status back to GitHub.
   
   •	This setup provides immediate feedback for developers and ensures the application is stable, reliable, and production-ready.
________________________________________
<h3>System Overview</h3>

<h4>User Roles:</h4>
   1.	Guest Users: Browse available bikes without logging in.
   
   2.	Registered Users (Renters): Book bikes, upload verification documents, and make payments.
   
   3.	Bike Owners: Add bikes with technical details and legal documents, manage availability, and approve booking requests.
   
   4.	Admins: Verify documents, approve/reject bookings, manage prices, and oversee the platform.

<h4>System Flow:</h4>

   •	Booking Flow: Guest → View Bikes → Login/Signup → Upload Documents → Admin Approval → QR Payment → Booking Confirmation.
   
   •	Renting Flow: Owner → Sign Up/Login → Add Bike Details & Documents → Admin Approval → Make Available → Receive Booking Requests.
   
   •	Admin Flow: Admin → Login → Manage Requests → Verify Documents → Fix Prices → Approve/Reject → Notify Users & Owners → Handle Disputes.
________________________________________
<h3>Technology Stack</h3>

   •	<b>Frontend:</b> React.js
   
   •	<b>Backend:</b> Node.js, Express.js
   
   •	<b>Storage</b>: Firebase realtime storage and documents.

   •	<b>Deployment/Hosting:</b> Render
   
   •	<b>Containerization:</b> Docker
   
   •	<b>CI/CD:</b> Jenkins with GitHub webhooks
   
   •	<b>Authentication:</b> OTP-based via email.

________________________________________

<h3>Team Contributions</h3>

<h4>Nihal (23211a6723) – Frontend Development</h4>

Nihal the frontend developer using React.js, designing and implementing dynamic, interactive, and responsive UI components. He manages application state, routing, and forms 
to ensure smooth navigation and user experience. He also enforces coding standards and best practices in frontend development, contributing to maintainable, scalable, and visually consistent interfaces across the platform.

<h4>Nikhil (23211a6724)– Backend & Jenkins</h4>

Nikhil oversees the backend development using Node.js and Express.js, building REST APIs that handle user authentication, bookings, bike management, and payment integration. He integrates 
Firebase Cloud Storage for secure file handling and document storage. Additionally, Nikhil manages the Jenkins CI/CD pipeline, automating Docker image builds, executing test suites, and 
reporting results back to GitHub. His work ensures reliable code integration, faster development cycles, and smooth deployment to the cloud.

<h4>Sai Ram (23211a6745)– Frontend & Render Deployment</h4>

Sai Ram focuses on frontend feature development, implementing components that improve usability and functionality. He works in tandem with Nihal to ensure consistent UI design and 
smooth interaction with backend services. Sai Ram also manages deployment on Render, leveraging its automated build and hosting system to maintain an always-up-to-date live application. 
He monitors deployments, ensures successful builds, and verifies that updates reflect correctly in the live environment.

<h4>Haritha (23211a6744)– GitHub & Frontend</h4>

Haritha manages the GitHub repository, overseeing version control, branch management, and collaborative workflows. She creates GitHub Apps, configures personal access tokens, and sets up 
webhooks to trigger automated CI/CD pipelines. In addition, Haritha contributes to frontend development, implementing UI components and ensuring that new features integrate seamlessly with 
the existing interface. She also reviews pull requests, provides constructive feedback, and ensures code quality across the project.

<h4>Vishnu (23211a6727)– Testing & Docker</h4>

Vishnu is responsible for application testing and containerization. He creates Dockerfiles for building testing images, which are used in the Jenkins CI/CD pipeline to validate feature 
branches. Vishnu conducts thorough functional, integration, and system testing, identifying bugs, verifying fixes, and ensuring that all components perform reliably in containerized 
environments. He collaborates with developers to improve test coverage and maintain high-quality, stable releases.

<h4>Anjali (23211a6762)– Jenkins Setup & CI/CD Support</h4>

Anjali manages the CI/CD infrastructure, writing the full Jenkinsfile and configuring Jenkins pipelines to automate building, testing, and deploying the application. She sets up Jenkins on 
a temporary cloud instance to provide webhook URLs for GitHub integration. Anjali handles environment variables, credentials, and agent configurations, monitors pipeline execution, and 
resolves any build or deployment issues. She ensures that code merges, automated testing, and deployments are seamless and reliable.

<h4>Viveka (23211a6748)– Testing Lead</h4>

Viveka leads the end-to-end testing efforts, coordinating strategies, defining test plans, and executing functional, system, and integration tests. She ensures that all new features and 
deployments meet quality standards, reports issues to developers, and verifies fixes. Viveka also oversees regression testing to maintain system stability and guides the team in improving 
testing practices. Her role guarantees that the application delivered to users is reliable, robust, and production-ready.





