# tracker-application

Deloitte Task Tracker Application Development
Problem Statement
In today's fast-paced business environment, managing tasks efficiently is crucial for the success of any project. This project aims to develop a Deloitte Task Tracker application using Angular, incorporating features akin to a Jira dashboard and Kanban board to streamline task and mange it effectively.
Brief Description
The Deloitte Task Tracker application will be a web-app that will feature user authentication, a dashboard for an overview of tasks and projects, a Kanban board for visual task management, and notification features to keep users informed about task updates. The application will be built using Angular, ensuring a responsive and user-friendly interface.
Requirements
Functional Requirements
1. User Authentication
    a. Users should be able to register and log in.
    b. Users should be able to log out and reset their passwords.
2. Dashboard
    a. Display an overview of tasks and projects.
    b. Show summary statistics such as the number of tasks in different statuses (To Do, In Progress, Done) and quick overview of task in each status.
    c. Show task detail page once clicked on specific task
    d. User can create and update task, restricting delete operation only for admin role.
    e. Option to change status of task (Good to have drag and drop feature as addition)
    f. Provide options to filter and search tasks.
    g. Provide notifications to admin if any task status is changed.
3. Task Management (For Admin role)
    a. Users should be able to create, update, and delete tasks.
    b.Tasks should have attributes such as title, description, status, assignee, anddue date.
    c.Users should be able to assign tasks to team members.
Non-Functional Requirements (NFRs)
1.Security
    a.User data should be encrypted both in transit and at rest.
    b.Implement role-based access control to restrict access to certain features.
2.Usability
    a.The application should be intuitive and easy to use.
3.Maintainability
    a.The codebase should follow best practices and be well-documented.
Milestones Milestone 1: Project Setup Milestone 2: Authentication Module Milestone 3: Dashboard Module Milestone 4: Task Management Module NOTE: •It is necessary to use a mock API server such as json-server or mockbin and integrate these APIs into the application.•Additionally, you need to add the project to GitHub by creating a separate repository.