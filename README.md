# Agent Dashboard

## Overview

Agent Dashboard is a comprehensive toolkit designed to help agents perform daily tasks more efficiently. Currently, the project includes an email template API for creating and managing common email templates.

## Features

- User authentication and management
- CRUD operations for email templates
- API documentation with Swagger UI

## Requirements

- Python 3.11 or higher
- Docker (for containerization)

## Installation

```bash
git clone https://github.com/yourusername/AgentDashboard.git
cd AgentDashboard
```
## Running the Application

### With Docker
```bash
docker build -f Dockerfile.dockerfile -t agent-dashboard .
```
```bash
docker run -d -p 8000:8000 agent-dashboard
```

### Without Docker
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate` 
```
```bash 
pip install -r requirements.txt
```
```bash
uvicorn app.main:app
```

## Accessing the API

- Navigate to http://localhost:8000/docs for SwaggerUI API Schema
- Navigate to http://localhost:8000/redoc for ReDoc API Schema

## Roadmap

The Agent Dashboard aims to be a comprehensive toolkit for agents, and the following features are planned for future releases:

### Future Features

- **Email Template API Enhancements**
  - Support for additional email formats and styles
  - User created sharable templates

- **User Authentication and Management**
  - Implement role-based access control
  - Single Sign-on Integration

- **User Formatting**
  - Implement the formatting of user information to keep data shared between users uniform. 

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/MIT) file for details.

## Acknowledgments

- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)
- [Docker](https://www.docker.com/)