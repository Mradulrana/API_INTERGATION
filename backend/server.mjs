import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";  // To serve static files
import fetch from "node-fetch";  // For making API calls
import { fileURLToPath } from 'url';  // For getting the current directory

dotenv.config();

// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());  // To parse JSON bodies
app.use(express.static(path.join(__dirname, '../public')));  // To serve static files (HTML, CSS, JS)

// Root route to serve your homepage (or a simple test)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));  // Serve the homepage (index.html)
});

// API route to classify the search query and fetch GPT response
app.post("/api/classify", async (req, res) => {
    const { query } = req.body;

    // Check if query exists
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    // Perform classification based on the query
    const category = classifyQuery(query);

    // If category is unrelated, return early
    if (category === "Unrelated") {
        return res.json({ valid: false, category, gptResponse: null });
    }

    // Fetch GPT response using the OpenAI API
    try {
        const gptResponse = await fetchGPTResponse(query);
        res.json({ valid: true, category, gptResponse });
    } catch (error) {
        console.error("Error fetching GPT response:", error);
        res.status(500).json({ error: "Error fetching GPT response" });
    }
});

// Function to classify a query (adapt as needed)
function classifyQuery(query) {
    const relatedCategories = [
        "Beauty", "Fashion", "Accessories", "Skincare", "Makeup", 
        "Haircare", "Nails", "Perfume", "Jewelry", "Footwear", 
        "Handbags", "Watches", "Lingerie", "Cosmetics", "Eyewear", 
        "Style", "Clothing", "Trends", "Outfits", "Hairstyles", 
        "Tanning", "Shaving", "Body Care", "Facial Treatments", "Spa", 
        "Fitness", "Wellness", "Health", "Menswear", "Womenswear", 
        "Totes", "Sunglasses", "Shoes", "Scarves", "Belts", 
        "Hats", "Boots", "Bags", "Capes", "Vintage", "Streetwear","Shampoo","2024", "Hair", "Dryers"
      ];
      

    // Simple classification logic based on keywords (you can replace with more advanced logic)
    for (let category of relatedCategories) {
        if (query.toLowerCase().includes(category.toLowerCase())) {
            return category;
        }
    }
    return "Unrelated";  // Return "Unrelated" if no valid category is found
}

// Function to fetch GPT response from OpenAI
async function fetchGPTResponse(query) {
    const gptApiUrl = process.env.CHATGPT_API_URL;
    const gptApiKey = process.env.GPT_API_KEY;

    const requestBody = {
        model: "gpt-4-turbo",  // You can adjust the model as necessary
        messages: [{ role: "user", content: query }],
        max_tokens: 100,  // Adjust the max tokens as needed
    };

    const response = await fetch(gptApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${gptApiKey}`,
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.choices[0].message.content;  // Return the GPT response content
}

// Route for verifying reCAPTCHA (optional, depends on your logic)
app.post("/verify-recaptcha-enterprise", async (req, res) => {
    const { token, action } = req.body;

    // Validate reCAPTCHA response with Google's API
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const verifyResponse = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
            res.json({ success: true, score: verifyData.score });
        } else {
            res.json({ success: false, error: "reCAPTCHA verification failed" });
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
