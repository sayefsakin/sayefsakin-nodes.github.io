const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for portfolio data with better error handling
app.get('/api/resume', (req, res) => {
    // Try multiple possible locations for the JSON file
    const possiblePaths = [
        path.join(__dirname, 'public', 'resume.json'),
        path.join(__dirname, 'resume.json'),
        path.join(__dirname, 'data', 'resume.json')
    ];

    let portfolioData = null;
    let foundPath = null;

    for (const filePath of possiblePaths) {
        try {
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8');
                portfolioData = JSON.parse(rawData);
                foundPath = filePath;
                break;
            }
        } catch (error) {
            console.warn(`Could not read ${filePath}:`, error.message);
            continue;
        }
    }

    if (portfolioData) {
        console.log(`✅ Portfolio data loaded from: ${foundPath}`);
        res.json(portfolioData);
    } else {
        console.warn('❌ Portfolio data file not found in any expected location');
        console.log('📁 Checked these paths:');
        possiblePaths.forEach(p => console.log(`   - ${p}`));
        
        // Return default data as fallback
        const defaultData = {
            "education": [
                {
                    "title": "Sample Education Entry",
                    "institution": "Please create resume.json file",
                    "date": "2020 - 2024",
                    "description": "Add your resume.json file to the public folder to see your actual data here."
                }
            ],
            "experience": [
                {
                    "title": "Sample Experience Entry",
                    "company": "Please create resume.json file",
                    "date": "2023 - Present",
                    "description": "Add your resume.json file to the public folder to see your actual data here."
                }
            ]
        };
        
        res.json(defaultData);
    }
});

// Debug endpoint to check file system
app.get('/debug/files', (req, res) => {
    try {
        const publicDir = path.join(__dirname, 'public');
        const rootDir = __dirname;
        
        const publicFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [];
        const rootFiles = fs.readdirSync(rootDir);
        
        res.json({
            currentDirectory: __dirname,
            publicDirectory: publicDir,
            publicDirectoryExists: fs.existsSync(publicDir),
            filesInPublic: publicFiles,
            filesInRoot: rootFiles,
            portfolioDataExists: {
                inPublic: fs.existsSync(path.join(publicDir, 'resume.json')),
                inRoot: fs.existsSync(path.join(rootDir, 'resume.json'))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio website running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔍 Debug info available at: http://localhost:${PORT}/debug/files`);
    
    // Check if portfolio data file exists on startup
    const dataPath = path.join(__dirname, 'public', 'resume.json');
    if (fs.existsSync(dataPath)) {
        console.log(`✅ Portfolio data file found at: ${dataPath}`);
    } else {
        console.log(`❌ Portfolio data file not found. Please create: ${dataPath}`);
    }
});