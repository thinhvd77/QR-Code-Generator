const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// File upload setup
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Google Drive API setup
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

function authorize() {
    try {
        if (!fs.existsSync(CREDENTIALS_PATH)) {
            console.error('credentials.json not found!');
            throw new Error('credentials.json not found!');
        }
        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        if (fs.existsSync(TOKEN_PATH)) {
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
            oAuth2Client.setCredentials(token);
            return oAuth2Client;
        } else {
            console.error('token.json not found!');
            throw new Error('Token not found. Run the authentication script to generate token.json.');
        }
    } catch (err) {
        console.error('Error in authorize():', err.message);
        throw err;
    }
}

async function uploadFileToDrive(filePath, fileName, mimeType) {
    const auth = authorize();
    const drive = google.drive({ version: 'v3', auth });
    // upload to specific folder if needed
    const folderId = '1Tz6E6QW0oHimWohrRIdO_opWeoW3fNgX';
    const fileMetadata = { name: fileName, parents: [folderId] };

    const media = { mimeType, body: fs.createReadStream(filePath) };
    
    const file = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
    });
    // Make file public
    await drive.permissions.create({
        fileId: file.data.id,
        requestBody: { role: 'reader', type: 'anyone' },
    });
    // Get webViewLink
    const fileInfo = await drive.files.get({
        fileId: file.data.id,
        fields: 'webViewLink',
    });
    return fileInfo.data.webViewLink;
}

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('POST /upload called');
        console.log('req.file:', req.file);
        const file = req.file;
        if (!file) {
            console.error('No file uploaded!');
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const link = await uploadFileToDrive(file.path, file.originalname, file.mimetype);
        fs.unlinkSync(file.path); // Clean up local file
        res.json({ link });
    } catch (err) {
        console.error('Error in /upload:', err);
        res.status(500).json({ error: err.message });
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => {
    console.log(`Express app running on http://localhost:${PORT}`);
});
