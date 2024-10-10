const supabase = require('../../config/database');
const config = require('../../config/config');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Fetch all embeddings from the Supabase database
const getAllEmbedding = async () => {
    try {
        const { data, error } = await supabase
            .from('word_embedding')
            .select('*');

        if (error) {
            throw new Error(`Error fetching embeddings: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error in getAllEmbedding:', error);
        return null; // Or handle it as needed
    }
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));

    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

// Generate embedding using Google Generative AI
async function googleAI(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(prompt);
        return result.embedding; // Return embedding directly
    } catch (error) {
        console.error('Error in googleAI:', error);
        throw new Error('Failed to generate embedding');
    }
}

// Perform a user search based on the provided body
const userSearch = async (body) => {
    try {
        // Generate the embedding for the user's query
        const queryEmbedding = await googleAI(body);
        
        const { data: embeddings, error } = await supabase
            .from('word_embedding')
            .select('*');

        if (error) {
            throw new Error(`Error fetching embeddings: ${error.message}`);
        }

        // Calculate similarity scores
        const results = embeddings.map(entry => {
            // Parse the string embedding into an array
            let embedding;
            try {
                embedding = JSON.parse(entry.embedding);
            } catch (parseError) {
                console.error('Error parsing embedding for entry:', entry, parseError);
                embedding = []; // or handle the error as needed
            }

            // Check if the parsed embedding is an array
            if (!Array.isArray(embedding)) {
                console.error('Parsed embedding is not an array:', embedding);
                return { ...entry, similarity: null }; // Handle error gracefully
            }

            // Calculate similarity
            const similarity = cosineSimilarity(queryEmbedding.values, embedding);
            return { ...entry, similarity };
        });

        // Sort results by similarity (descending)
        const sortedResults = results.sort((a, b) => b.similarity - a.similarity);

        // Optionally limit the number of results returned
        const topResults = sortedResults.slice(0, 10); // Return top 10 results

        return topResults; // Return the most relevant embeddings
    } catch (error) {
        console.error('Error in userSearch:', error);
        return null; // Handle errors as needed
    }
};

// Create a new embedding from the prompt
const newEmbedding = async (prompt, documentId) => {
    try {
        const embedding = await googleAI(prompt);
        // Insert the embedding into the Supabase database
        const { data, error } = await supabase
            .from('word_embedding')
            .insert([
                { chunks: prompt, embedding: embedding.values, document: 1 }, // Pass dynamic document ID
            ])
            .select();

        if (error) {
            throw new Error(`Supabase insertion error: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error generating embedding:', error);
        return { success: false, error: error.message }; // Provide a more informative error
    }
};

module.exports = {
    getAllEmbedding,
    newEmbedding,
    userSearch
};