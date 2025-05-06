# Helpdesk (Tech Desk) - Issue Management SaaS Platform

**Helpdesk**, also known as **Tech Desk**, is a self-hosted SaaS platform designed to simplify issue management for businesses. Built with Angular and .NET Core, it streamlines ticket handling, enables real-time communication via SignalR, and supports custom Single Sign-On (SSO) for seamless integration into your organization’s ecosystem.

---

## 🚀 Features

- **User Authentication & Company Registration**  
  - JWT-based login system.
  - Company Admins can register their organizations and onboard users.
  - Supports multiple roles: `Super Admin`, `Company Admin`, and `Normal User`.

- **Dashboard**  
  - Visual analytics showing ticket volume, resolution status, and response time metrics.
  - Enables admins to monitor helpdesk performance at a glance.

- **User Management**  
  - CRUD operations for managing company-specific users.
  - Role-based access control.

- **Ticket Management**  
  - Central interface for creating, updating, and tracking tickets.
  - Supports threaded ticket conversations with file attachment support.

- **Real-Time Chat**  
  - SignalR-based in-app chat between users and admins.
  - Instant message delivery with push-style notifications.

- **My Profile**  
  - Admins and users can view and edit their personal details.

- **Settings Panel**  
  - Configure time zone, upload company logos, and define brand colors.
  - Generate embed code to integrate the Helpdesk chatbot on external sites.

- **Custom SSO Integration**  
  - Companies can configure SSO for seamless login from their existing platforms.
  - Developer documentation included for smooth setup.

---

## 🛠 Tech Stack

- **Frontend**: Angular 16
- **Backend**: ASP.NET Core 7 
- **Database**: Microsoft SQL Server  
- **Real-Time Communication**: SignalR (integrated in the same app)  
- **Authentication**: JWT  
- **Hosting**: IIS (on a dedicated server)  

---

## 🧑‍💻 Getting Started

### 1. Prerequisites

- .NET 6 SDK or later
- Node.js 2-
- SQL Server (2019 or later)
- IIS with WebSocket support enabled

### 2. Setup Instructions

#### Backend (API)

```bash
cd Helpdesk.API
dotnet restore
dotnet ef database update
dotnet run
