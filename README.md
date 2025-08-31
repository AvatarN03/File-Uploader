# File-Uploader

A modern, feature-rich file upload application built with Node.js and Express. This application provides a clean interface for uploading, managing, and organizing files with support for multiple file types, drag-and-drop functionality, and real-time upload progress.

## 🚀 Features

### Core Functionality
- **Multiple File Upload**: Upload multiple files simultaneously
- **Drag & Drop Interface**: Intuitive drag-and-drop file selection
- **Progress Tracking**: Real-time upload progress with visual indicators
- **File Type Validation**: Configurable file type restrictions
- **Size Limitations**: Customizable file size limits
- **Preview Generation**: Image and document previews
- **Download Management**: Secure file download system

### Advanced Features
- **Cloud Storage Integration**: Support for AWS S3, Google Cloud, Azure
- **File Organization**: Folder creation and file categorization
- **User Authentication**: Secure user accounts and file ownership
- **Responsive Design**: Mobile-friendly interface
- **File Metadata**: Extract and display file information
- **Bulk Operations**: Select and manage multiple files at once
- **Share Links**: Generate shareable links for uploaded files

## 🛠️ Tech Stack

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **Multer** - Multipart/form-data handling
- **MongoDB/PostgreSQL** - Database for file metadata
- **Mongoose/Sequelize** - Database ORM
- **JWT** - Authentication tokens
- **Sharp** - Image processing
- **AWS SDK** - Cloud storage (optional)

### Frontend
- **HTML5** - Semantic markup
- **CSS3/SCSS** - Styling with modern features
- **Vanilla JavaScript/React** - Interactive user interface
- **Axios** - HTTP client for API calls
- **File API** - Native browser file handling
- **Dropzone.js** - Enhanced drag-and-drop functionality

## 📋 Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn
- MongoDB or PostgreSQL
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AvatarN03/File-Uploader.git
   cd File-Uploader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL=mongodb://localhost:27017/fileuploader
   # or for PostgreSQL
   # DATABASE_URL=postgresql://username:password@localhost:5432/fileuploader
   
   # File Storage Configuration
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760  # 10MB in bytes
   ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,doc,docx,txt,zip
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Cloud Storage (Optional)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_BUCKET_NAME=your-s3-bucket
   AWS_REGION=us-west-2
   
   # Email Configuration (for sharing)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Create upload directories**
   ```bash
   mkdir uploads
   mkdir uploads/images
   mkdir uploads/documents
   mkdir uploads/temp
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
File-Uploader/
├── client/                 # Frontend files
│   ├── public/
│   │   ├── index.html
│   │   ├── upload.html
│   │   └── manage.html
│   ├── src/
│   │   ├── js/
│   │   │   ├── upload.js
│   │   │   ├── fileManager.js
│   │   │   └── utils.js
│   │   ├── css/
│   │   │   ├── main.css
│   │   │   └── upload.css
│   │   └── components/
│   └── assets/
├── server/                 # Backend files
│   ├── controllers/
│   │   ├── uploadController.js
│   │   ├── fileController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── File.js
│   │   └── User.js
│   ├── routes/
│   │   ├── upload.js
│   │   ├── files.js
│   │   └── auth.js
│   ├── services/
│   │   ├── cloudStorage.js
│   │   ├── imageProcessor.js
│   │   └── emailService.js
│   └── utils/
│       ├── fileUtils.js
│       └── validators.js
├── uploads/               # File storage directory
├── tests/                # Test files
├── config/               # Configuration files
│   ├── database.js
│   ├── multer.js
│   └── cloudinary.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js            # Entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/progress/:id` - Get upload progress
- `DELETE /api/upload/cancel/:id` - Cancel upload

### File Management
- `GET /api/files` - List user files
- `GET /api/files/:id` - Get file details
- `GET /api/files/:id/download` - Download file
- `PUT /api/files/:id` - Update file metadata
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/:id/share` - Create share link

### Folders
- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

## 🎯 Usage Examples

### Basic File Upload

```javascript
// Frontend upload function
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload/single', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const result = await response.json();
        console.log('File uploaded:', result);
    } catch (error) {
        console.error('Upload failed:', error);
    }
}
```

### Drag and Drop Implementation

```javascript
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadFile(file));
});
```

### Upload Progress Tracking

```javascript
function uploadWithProgress(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                updateProgressBar(percentComplete);
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error('Upload failed'));
            }
        });
        
        xhr.open('POST', '/api/upload/single');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    });
}
```

## 🔐 Security Features

### File Validation
- File type whitelist/blacklist
- File size limitations
- Malicious file detection
- Virus scanning integration

### Access Control
- User authentication required
- File ownership verification
- Permission-based access
- Secure download links with expiration

### Data Protection
- Encrypted file storage
- Secure file names (UUID-based)
- Input sanitization
- SQL injection prevention

## 🌐 Cloud Storage Integration

### AWS S3 Configuration

```javascript
// config/aws.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

module.exports = { s3 };
```

### Upload to S3

```javascript
const uploadToS3 = async (file, key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    
    return s3.upload(params).promise();
};
```

## 🧪 Testing

Run the test suite:

```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- upload.test.js
```

### Sample Test

```javascript
// tests/upload.test.js
const request = require('supertest');
const app = require('../server');

describe('File Upload', () => {
    test('should upload a file successfully', async () => {
        const response = await request(app)
            .post('/api/upload/single')
            .attach('file', './tests/fixtures/test-image.jpg')
            .set('Authorization', 'Bearer valid-token');
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('fileId');
    });
});
```

## 🚀 Deployment

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --only=production
   COPY . .
   RUN mkdir -p uploads
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t file-uploader .
   docker run -p 3000:3000 --env-file .env file-uploader
   ```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your-production-db-url
JWT_SECRET=your-production-jwt-secret
UPLOAD_DIR=/var/uploads
MAX_FILE_SIZE=52428800  # 50MB
```

## 📊 Performance Optimization

### File Processing
- Implement file chunking for large uploads
- Use worker threads for intensive processing
- Cache frequently accessed files
- Implement file compression

### Database Optimization
- Index file metadata fields
- Use database connection pooling
- Implement query optimization
- Archive old file records

## 🐛 Troubleshooting

### Common Issues

**File Size Limit Exceeded**
```javascript
// Error: File too large
if (req.file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit');
}
```

**Unsupported File Type**
```javascript
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
if (!allowedTypes.includes(req.file.mimetype)) {
    throw new Error('File type not supported');
}
```

**Upload Directory Permissions**
```bash
# Fix permissions
chmod 755 uploads/
chown -R node:node uploads/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write comprehensive tests
- Update documentation
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Multer Documentation](https://github.com/expressjs/multer)
- [File API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/)
- [Express.js Documentation](https://expressjs.com/)

## 🙏 Acknowledgments

- Express.js community for the robust framework
- Multer developers for excellent file upload handling
- Contributors to open-source file upload libraries
- MDN Web Docs for comprehensive File API documentation

---

**Built with ❤️ by [AvatarN03](https://github.com/AvatarN03)**

*Ready to handle all your file upload needs!*
