const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = {
    // Testimonial profile pictures - professional headshots
    'testimonial-1.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    'testimonial-2.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    'testimonial-3.jpg': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
};

const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Download each image
Object.entries(imageUrls).forEach(([filename, url]) => {
    const filePath = path.join(imagesDir, filename);
    
    https.get(url, (response) => {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
            console.log(`Downloaded: ${filename}`);
            fileStream.close();
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}:`, err.message);
    });
}); 