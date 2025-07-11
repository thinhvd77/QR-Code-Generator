# QR Code Generator

A simple ExpressJS web application to generate QR codes from user input.

## Features
- Generate QR codes for any text or URL
- Simple web interface
- API endpoint for QR code generation

## Getting Started

### Install dependencies
```
npm install
```

### Run the application
```
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `index.js`: Main server file
- `public/`: Static files (HTML, CSS, JS)

## API
- `POST /generate` with JSON `{ text: "your text" }` returns `{ qr: "data:image/png;base64,..." }`
