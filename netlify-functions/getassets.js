const fs = require('fs');
const path = require('path');

// Define the directory containing the assets, relative to the function's root
const ASSETS_DIR = path.join(process.cwd(), 'assets');

// Helper function to capitalize the first letter
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// This is the main handler for the Netlify function
exports.handler = async function(event, context) {
    try {
        // Read all file names from the 'assets' directory
        const files = await fs.promises.readdir(ASSETS_DIR);
        
        // Process the file list into a structured JSON format for the front-end
        const assetList = files.map(filename => {
            const parts = filename.split('.');
            const extension = parts.pop();
            const name = parts.join('.').replace(/-/g, ' '); // Clean up name for display
            
            // Determine a simple type for display
            let type = 'File';
            let description = 'General Educational Material';
            
            if (extension === 'pdf') {
                type = 'PDF';
                description = 'Detailed lecture notes or reading material.';
            } else if (['docx', 'doc'].includes(extension)) {
                type = 'DOCX';
                description = 'Editable document template or assignment.';
            } else if (['pptx', 'ppt'].includes(extension)) {
                type = 'PPT';
                description = 'Presentation slides for review.';
            } else if (['xlsx', 'csv'].includes(extension)) {
                type = 'Data';
                description = 'Spreadsheet or data sample.';
            }
            
            return {
                filename: filename,
                name: capitalize(name),
                type: type,
                // These values are mocked since the function cannot easily get real file size/description
                size: 'Approx. 5 MB', 
                description: description
            };
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assetList),
        };
    } catch (error) {
        console.error("Error reading assets directory:", error);
        
        // This catch block handles the error if the 'assets' folder is completely missing
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                error: "Failed to read assets.", 
                detail: error.message 
            }),
        };
    }
};