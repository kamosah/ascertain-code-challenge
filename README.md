## Application Views

The following tables showcase the different views of the application in both light and dark modes:

### Patient List View

| Light Mode | Dark Mode |
|------------|-----------|
| ![Patient List Light](https://github.com/user-attachments/assets/5781ea7b-56d2-4098-b5c8-5e920525ec2c) | ![Patient List Dark](https://github.com/user-attachments/assets/0613e663-dda4-433c-baed-d5281e56ed0d) |

### Patient Details - Details View

| Light Mode | Dark Mode |
|------------|-----------|
| ![Patient Details Light](https://github.com/user-attachments/assets/440105a9-d44b-41af-88a8-1e19eba5fef8) | ![Patient Details Dark](https://github.com/user-attachments/assets/f34a7e72-1d53-475d-97b1-7f98e62de457) |

### Patient Details - Encounters View

| Light Mode | Dark Mode |
|------------|-----------|
| ![Patient Encounters Light](https://github.com/user-attachments/assets/467522a5-678c-4298-9748-6626115aaf89) | ![Patient Encounters Dark](https://github.com/user-attachments/assets/279bb796-aaaa-4c35-a817-9f708445945a) |

### Patient Details - Medications View

| Light Mode | Dark Mode |
|------------|-----------|
| ![Patient Medications Light](https://github.com/user-attachments/assets/369bba5d-a429-4958-b6d8-e7675ac5dd28) | ![Patient Medications Dark](https://github.com/user-attachments/assets/06654550-020d-4bd1-95ae-e71b2635eb00) |

## Production Usage

The frontend is hosted on Vercel, and the backend is deployed on Render. Note that the Render free tier spins down the backend after periods of inactivity, which may cause a delay of 30-60 seconds when you first visit the frontend or after a period of no requests. If you encounter a loading delay or an error (e.g., "API request failed"), please wait a moment and refresh the page. The backend will wake up, and subsequent requests will be faster.

To access the live application:

- **Frontend**: [https://ascertain-code-challenge.vercel.app/](https://ascertain-code-challenge.vercel.app/)
- **Backend API**: [https://ascertain-code-challenge-backend.onrender.com](https://ascertain-code-challenge-backend.onrender.com)
- **API Documentation**: [https://ascertain-code-challenge-backend.onrender.com/docs](https://ascertain-code-challenge-backend.onrender.com/docs)

If the frontend is unresponsive, try refreshing after a minute to allow the backend to start.

# Ascertain Code Challenge

This repository contains Ascertain's technical assessment.

## Project Structure

```text
├── backend/                   # FastAPI server application
│   ├── data/                  # FHIR data files
│   │   ├── documents/         # Medical documents (SOAP notes)
│   │   ├── encounters.json    # Patient encounters
│   │   ├── medication_requests.json # Medication requests
│   │   └── patients.json      # Patient records
│   ├── utils/                 # Utility functions
│   ├── main.py                # FastAPI application
│   └── README.md
├── frontend/                  # React client application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── patients/     # Patient-specific components
│   │   │   └── ui/           # General UI components
│   │   ├── views/            # Page-level components
│   │   │   └── patients/     # Patient views & tests
│   │   ├── queries/          # API queries and data fetching
│   │   ├── providers/        # React context providers
│   │   ├── styles/           # Global styles
│   │   └── test/             # Test utilities
│   ├── public/               # Static assets
│   └── README.md
├── docker-compose.yml         # Docker orchestration
└── README.md
```

The frontend follows a clean, modular architecture that separates:

- **Views**: Page-level components (like PatientList, PatientDetails)
- **Components**: Reusable UI components organized by feature
- **Queries**: Data fetching and API interaction logic
- **Providers**: React context and global state management

## Getting Started

You have two options for setting up this project:

### Option 1: Individual Setup

Each component has its own detailed setup instructions:

- See [`frontend/README.md`](frontend/README.md) for React application setup
- See [`backend/README.md`](backend/README.md) for FastAPI service setup

These files contain specific requirements, available scripts, and component-specific documentation.

### Option 2: Docker Setup

```bash
docker-compose up -d
```

This will start both frontend and backend services:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8000>
- API Documentation: <http://localhost:8000/docs>

## Technology Stack

### Frontend

- React 19 with TypeScript
- Mantine UI

### Backend

- FastAPI (Python)
- FHIR healthcare data structure
