# SkillMatch Backend Documentation

## Project Overview
SkillMatch is a backend application built with Node.js, Express, and MongoDB. It facilitates connecting users with job opportunities, managing applications, and networking.

## Setup Instructions

**Environment Variables:**
    Create a `.env` file in the root directory with the following variables:
    - `PORT`: Server port (default: 5000)
    - `MONGO_URI`: MongoDB connection string
    - `JWT_SECRET`: Secret key for JWT
    - `JWT_EXPIRES_IN`: JWT expiration time
    - `NODE_ENV`: Environment (development/production)
    - `FRONTEND_URL`: URL of the frontend application
    - `LOCAL_URL`: Local URL for development

## API Endpoints

**Base URL:** `/api`

### Auth Routes (`/auth`)
| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/signup` | Register a new user | No | `username`, `email`, `password`, `passwordConfirm`, `skills` (opt), `role` (opt) |
| POST | `/verify` | Verify account with code | No | `email`, `code` |
| POST | `/resendCode` | Resend verification code | No | `email` |
| POST | `/login` | Login user | No | `email`, `password` |
| POST | `/forgotPassword` | Request password reset | No | `email` |
| POST | `/verifyResetCode` | Verify password reset code | No | `email`, `code` |
| PATCH | `/resetPassword` | Reset password | No | `email`, `code`, `newPassword`, `passwordConfirm` |
| GET | `/me` | Get current user profile | Yes | None |
| PATCH | `/updateMe` | Update current user profile | Yes | `username`, `email`, `bio`, `location`, `skills`, `interests` |
| PATCH | `/updateMyPassword` | Update current user password | Yes | `passwordCurrent`, `password`, `passwordConfirm` |
| GET | `/discover` | Get suggested users | Yes | None |
| GET | `/:id` | Get specific user profile | Yes | None |
| PATCH | `/updateMyPhoto` | Update profile photo | Yes | `file` (multipart/form-data) |
| GET | `/me/saved` | Get saved opportunities | Yes | None |
| PATCH | `/updateSkillsAndInterests` | Update skills and interests | Yes | `skills`, `interests`, `bio` |
| DELETE | `/deleteMe` | Deactivate account | Yes | None |

### Opportunity Routes (`/opportunities`)
| Method | Endpoint | Description | Auth Required | Role | Request Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/recommended` | Get recommended opportunities | Yes | Any | None |
| GET | `/` | Get all opportunities | No | Any | None |
| GET | `/:id` | Get specific opportunity | No | Any | None |
| POST | `/save/:id` | Save an opportunity | Yes | Any | None |
| DELETE | `/unsave/:id` | Unsave an opportunity | Yes | Any | None |
| POST | `/apply/:id` | Apply to an opportunity | Yes | Any | None |
| POST | `/` | Create an opportunity | Yes | Admin, Manager | `title`, `description`, `company`, `requiredSkills`, `tags`, `level`, `type`, `salary` |
| PATCH | `/:id` | Update an opportunity | Yes | Admin, Manager | Partial of Create Body |
| DELETE | `/:id` | Delete an opportunity | Yes | Admin, Manager | None |

### Application Routes (`/applications`)
| Method | Endpoint | Description | Auth Required | Role | Request Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/my-applications` | Get current user's applications | Yes | User | None |
| GET | `/status/:opportunityId` | Get application status for an opportunity | Yes | User | None |
| PATCH | `/:id/status` | Update application status | Yes | Admin, Manager | `status` (enum: pending, reviewed, accepted, rejected), `notes` (opt) |

### Connection Routes (`/connections`)
| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | Get all connections | Yes | None |
| POST | `/send` | Send connection request | Yes | `receiverId` |
| GET | `/status/:receiverId` | Get connection status with a user | Yes | None |
| POST | `/:connectionId/accept` | Accept connection request | Yes | None |
| GET | `/pending` | Get pending connection requests | Yes | None |
| POST | `/:connectionId/reject` | Reject connection request | Yes | None |

### Notification Routes (`/notifications`)
| Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | Get all notifications | Yes | None |
| POST | `/:notificationId/read` | Mark notification as read | Yes | None |
| POST | `/read-all` | Mark all notifications as read | Yes | None |

### Manager Routes (`/manager`)
| Method | Endpoint | Description | Auth Required | Role | Request Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/dashboard` | Get manager dashboard stats | Yes | Manager, Admin | None |
| GET | `/opportunities` | Get manager's opportunities | Yes | Manager, Admin | None |
| GET | `/applications` | Get applications for manager's opportunities | Yes | Manager, Admin | None |

### Admin Routes (`/admin`)
| Method | Endpoint | Description | Auth Required | Role | Request Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GET | `/dashboard` | Get admin dashboard stats | Yes | Admin | None |
| GET | `/users` | Get all users | Yes | Admin | None |
| PATCH | `/users/:id` | Update a user | Yes | Admin | `name`, `email`, `role`, `active`, `isVerified` |
| DELETE | `/users/:id` | Delete a user | Yes | Admin | None |
| GET | `/applications` | Get all applications | Yes | Admin | None |
| GET | `/opportunities` | Get all opportunities | Yes | Admin | None |
| POST | `/opportunities` | Create an opportunity | Yes | Admin | `title`, `description`, `company`, `requiredSkills`, `tags`, `level`, `type`, `salary` |
| GET | `/opportunities/:id` | Get an opportunity | Yes | Admin | None |
| PATCH | `/opportunities/:id` | Update an opportunity | Yes | Admin | Partial of Create Body |
| DELETE | `/opportunities/:id` | Delete an opportunity | Yes | Admin | None |
