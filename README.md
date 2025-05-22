# Get Vid

A web application for downloading videos from various platforms including YouTube, TikTok, and X (formerly Twitter).

## Features

- Download videos from YouTube with quality selection
- Simple and intuitive web interface
- Video information preview with thumbnails (for YouTube)
- Quality selection options
- Mobile-responsive design

## Project Status

- ✅ YouTube downloads: Working with quality selection
- ⚠️ TikTok downloads: Backend placeholders added (requires API implementation)
- ⚠️ X/Twitter downloads: Backend placeholders added (requires API implementation)

## Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm (Node package manager)

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/emiliancristea/get-vid.git
   cd get-vid
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:3000`

### Production Setup

1. Clone the repository:
   ```
   git clone https://github.com/emiliancristea/get-vid.git
   cd get-vid
   ```

2. Install dependencies:
   ```
   npm install --production
   ```

3. Start the server:
   ```
   npm start
   ```

## Deployment Options

### Heroku Deployment

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Login to Heroku:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
5. Push to Heroku:
   ```
   git push heroku main
   ```
6. Open your app:
   ```
   heroku open
   ```

### Railway Deployment

1. Create a [Railway](https://railway.app) account
2. Install the Railway CLI:
   ```
   npm i -g @railway/cli
   ```
3. Login to Railway:
   ```
   railway login
   ```
4. Initialize a new project:
   ```
   railway init
   ```
5. Deploy your app:
   ```
   railway up
   ```

### Render Deployment

1. Create a [Render](https://render.com) account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add any necessary environment variables

## Future Improvements

- Implement TikTok video downloads using their official API or better scraping methods
- Implement X/Twitter video downloads using their official API
- Add more download options and formats
- Add user authentication for premium features
- Implement video conversion options
- Add download history tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [ISC License](LICENSE).
