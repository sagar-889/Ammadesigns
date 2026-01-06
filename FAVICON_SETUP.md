# Favicon Setup Instructions

## Steps to Add Your Logo as Website Icon

### 1. Save the Logo Image
1. Save your logo image as `logo.png` or `favicon.png`
2. Place it in the `frontend/public/` folder

### 2. Create Multiple Favicon Sizes (Recommended)
For best compatibility across devices, create these sizes:
- `favicon.ico` (16x16, 32x32, 48x48 combined)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

You can use online tools like:
- https://realfavicongenerator.net/
- https://favicon.io/

### 3. Update index.html
The file has been updated to include all favicon references.

### Quick Setup (Minimum):
If you just want a basic favicon:
1. Save your logo as `frontend/public/favicon.ico`
2. The updated index.html will automatically use it

### Files Location:
```
frontend/
  public/
    favicon.ico          ← Main favicon
    logo.png            ← Your logo
    apple-touch-icon.png ← iOS icon
    favicon-16x16.png
    favicon-32x32.png
    android-chrome-192x192.png
    android-chrome-512x512.png
```

### After Adding Files:
1. Rebuild frontend: `npm run build`
2. Deploy to Vercel
3. Clear browser cache to see new favicon
