# URL Shortener

A web application that converts long URLs into short, shareable links.

## Features

- **URL Shortening**: Convert long URLs into concise, easy-to-share short links
- **Custom Aliases**: Create custom short codes for your URLs
- **Click Tracking**: Track the number of times each short link is accessed
- **QR Code Generation**: Generate QR codes for short links
- **Link Management**: View, edit, and delete your shortened URLs
- **Expiration Control**: Set expiration dates for short links

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortner
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Start the application:
```bash
npm start
```

## Usage

1. Enter a long URL in the input field
2. Optionally customize the short code
3. Click "Shorten" to generate your short link
4. Copy and share the shortened URL
5. Track clicks and analytics from your dashboard

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB/MySQL
- **API**: RESTful API

## File Structure

```
url-shortner/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── routes/
│   └── api.js
├── models/
│   └── url.js
├── server.js
└── README.md
```

## API Endpoints

- `POST /api/shorten` - Create a new short URL
- `GET /api/:shortCode` - Redirect to the original URL
- `GET /api/stats/:shortCode` - Get analytics for a short link
- `DELETE /api/:shortCode` - Delete a short link

## License

MIT License
