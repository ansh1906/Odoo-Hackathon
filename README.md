# AssetFlow

## Overview

AssetFlow is a system that helps big organizations manage their assets, employees and shared resources. It makes it easy to keep track of everything.

* It helps you manage assets, employees, shared resources and maintenance work.
* It provides a place to track the whole life of an asset.
* It helps you manage who uses what and when.
* It prevents people from booking the thing at the same time.
* It keeps everything

The application gets rid of using spreadsheets to keep track of things. It gives you a system that is structured and based on roles to manage assets in a way.
AssetFlow helps you manage assets efficiently and securely. It is designed to simplify asset management and provides a platform, for tracking assets.
It also helps prevent booking conflicts and maintains transparency.

---

## Features

### Authentication and Authorization

- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Protected application routes

### Dashboard

- Real-time asset statistics
- Available and allocated asset count
- Active bookings overview
- Pending transfers
- Upcoming returns
- Maintenance summary
- Overdue asset notifications

### Organization Management

- Department management
- Employee directory
- Asset category management
- Role assignment and administration

### Asset Management

- Asset registration
- Automatic asset ID generation
- Asset categorization
- Asset status management
- Search and filtering
- Asset lifecycle tracking

Supported asset statuses include:

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

### Asset Allocation

- Allocate assets to employees
- Asset transfer requests
- Asset return workflow
- Allocation history
- Double allocation prevention

### Resource Booking

- Book shared organizational resources
- Booking conflict detection
- Booking management
- Upcoming reservation tracking

### Maintenance

- Raise maintenance requests
- Maintenance approval workflow
- Track maintenance progress
- Update asset status automatically

### Notifications

- Allocation updates
- Maintenance alerts
- Booking notifications
- Return reminders

---

## Core Business Rules

The system enforces the following business rules:

- An asset cannot be allocated to multiple users simultaneously.
- Shared resources cannot have overlapping bookings.
- Role-based permissions restrict administrative actions.
- Asset lifecycle changes are reflected throughout the system.

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Django
- Django REST Framework
- JWT Authentication

### Database

- SQLite

---

## Installation

### Clone the repository

```bash
git clone https://github.com/ansh1906/Odoo-Hackathon.git
cd Odoo-Hackathon
```

### Backend Setup

```bash
cd server

python -m venv venv
```

Activate the virtual environment.

Linux/macOS

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run database migrations.

```bash
python manage.py migrate
```

Start the backend server.

```bash
python manage.py runserver
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## Usage

1. Register or log in to the application.
2. Configure departments, employees, and asset categories.
3. Register organizational assets.
4. Allocate assets to employees or departments.
5. Manage resource bookings.
6. Raise and approve maintenance requests.
7. Monitor organizational activity through the dashboard.

---

## Future Enhancements

- QR code-based asset identification
- Barcode scanning support
- Email notifications
- Analytics and reporting
- AI-assisted maintenance recommendations
- PostgreSQL support for production
- Cloud deployment
- Mobile application

---
