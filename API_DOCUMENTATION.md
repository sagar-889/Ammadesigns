# API Documentation

Base URL: `http://localhost:5000/api`

## Public Endpoints

### Get All Services
```
GET /services
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Blouse Stitching",
    "description": "Custom blouse stitching",
    "price": 300.00,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get All Gallery Images
```
GET /gallery
```

**Response:**
```json
[
  {
    "id": 1,
    "image_url": "https://example.com/image.jpg",
    "title": "Designer Blouse",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Submit Contact Form
```
POST /contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "message": "I need a blouse stitching"
}
```

**Validation:**
- `name`: Required, non-empty string
- `phone`: Required, exactly 10 digits
- `message`: Required, non-empty string

**Response:**
```json
{
  "message": "Contact form submitted successfully"
}
```

## Admin Endpoints

### Admin Login
```
POST /admin/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Note:** Use the token in Authorization header for protected routes:
```
Authorization: Bearer <token>
```

### Get All Contacts (Protected)
```
GET /admin/contacts
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "phone": "9876543210",
    "message": "I need a blouse stitching",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Service (Protected)
```
POST /admin/services
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Service",
  "description": "Service description",
  "price": 500.00
}
```

**Response:**
```json
{
  "id": 5,
  "message": "Service created"
}
```

### Update Service (Protected)
```
PUT /admin/services/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Service",
  "description": "Updated description",
  "price": 600.00
}
```

**Response:**
```json
{
  "message": "Service updated"
}
```

### Delete Service (Protected)
```
DELETE /admin/services/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Service deleted"
}
```

### Create Gallery Item (Protected)
```
POST /admin/gallery
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "image_url": "https://example.com/image.jpg",
  "title": "Optional Title"
}
```

**Validation:**
- `image_url`: Required, must be valid URL

**Response:**
```json
{
  "id": 5,
  "message": "Gallery image added"
}
```

### Update Gallery Item (Protected)
```
PUT /admin/gallery/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "image_url": "https://example.com/new-image.jpg",
  "title": "Updated Title"
}
```

**Response:**
```json
{
  "message": "Gallery image updated"
}
```

### Delete Gallery Item (Protected)
```
DELETE /admin/gallery/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Gallery image deleted"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Valid 10-digit phone number required",
      "param": "phone"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch services"
}
```

## Testing with cURL

### Get Services
```bash
curl http://localhost:5000/api/services
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9876543210","message":"Test message"}'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create Service (with token)
```bash
curl -X POST http://localhost:5000/api/admin/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Service","description":"Description","price":500}'
```

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- express-rate-limit package
- Limit login attempts
- Limit contact form submissions

## CORS Configuration

Currently allows all origins in development. For production, update `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```
