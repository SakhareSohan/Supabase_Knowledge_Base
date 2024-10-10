const supabase = require('../../config/database');
const geminivectors = require('../word_embedding/user_services');

const fs = require('fs');
const pdf = require('pdf-parse');
const mime = require('mime-types');

const uploadFileToS3 = async (file) => {
    try {

        if (!file) {
            return 'Upload File Please';
        }

        const filePath = `public/${file.originalname}`; 

        const fs = require('fs');
        const fileBuffer = fs.readFileSync(file.path);

        console.log(fileBuffer);

        const { data, error } = await supabase
            .storage
            .from('Knowledge Document Repo') 
            .upload(filePath, fileBuffer, {
                cacheControl: '3600',  
                upsert: false   
            });

        if (error) {
            return error;
        }

        const fileType = mime.lookup(file.originalname) || 'application/octet-stream';

        let fileContent;

        // Process the file content based on its type
        if (fileType.startsWith('text/')) { // Check if the file is text-based
            fileContent = fileBuffer.toString('utf-8'); // Convert buffer to string
        } else if (fileType === 'application/pdf') { // Check if the file is a PDF
            // Extract text from the PDF
            const pdfData = await pdf(fileBuffer);
            fileContent = pdfData.text; // Extracted text from the PDF
        } else {
            console.warn('The uploaded file is not a supported file type. File type:', fileType);
            return 'Uploaded file is not a text-based or PDF file';
        }
        
        const prompts = createPrompts(fileContent, 600);

        const embeddings = await generateEmbeddings(prompts);
        
        console.log('Embeddings:', embeddings);
        return { data, embeddings };

    } catch (error) {
        console.error('File upload failed:', error);
        return error;
    }

};

function createPrompts(content, charLimit) {
    const prompts = [];
    const words = content.split(' ');

    let currentPrompt = '';
    for (const word of words) {
        if (currentPrompt.length + word.length + 1 <= charLimit) {
            currentPrompt += (currentPrompt ? ' ' : '') + word;
        } else {
            prompts.push(currentPrompt);
            currentPrompt = word; // Start a new prompt with the current word
        }
    }

    if (currentPrompt) {
        prompts.push(currentPrompt); // Push the last prompt if exists
    }

    return prompts;
};

async function generateEmbeddings(prompts) {
    const embeddings = [];
    
    for (const prompt of prompts) {
        // Replace with your embedding API call
        const embedding = await geminivectors.newEmbedding(prompt);
        embeddings.push(embedding);
    }

    return embeddings;
};

module.exports = {
    uploadFileToS3
};