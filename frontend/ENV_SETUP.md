# Environment Setup

## Create .env file

Create a `.env` file in the `frontend` folder with:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Enable backend API integration (set to true when backend is running)
REACT_APP_USE_API=false

# App Configuration
REACT_APP_NAME=Shop-E
REACT_APP_VERSION=1.0.0
```

## Toggle Backend Integration

- Set `REACT_APP_USE_API=false` to use localStorage (default)
- Set `REACT_APP_USE_API=true` to use backend API

## Important Notes

1. The `.env` file is gitignored for security
2. Use `.env.development` for local development
3. Never commit API keys or secrets
4. Copy `.env.development` to `.env` if it doesn't exist

