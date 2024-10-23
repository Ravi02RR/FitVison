import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from "../config/congif.js";

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}).single('foodImage');

const analysisPrompt = `
Analyze this food image and provide detailed information in the following JSON format:
{
    "foodIdentification": {
        "name": "Main food item name",
        "category": "Food category",
        "ingredients": ["List of visible ingredients"]
    },
    "nutritionalAnalysis": {
        "calories": "Estimated calories",
        "macronutrients": {
            "proteins": "Amount in grams",
            "carbohydrates": "Amount in grams",
            "fats": "Amount in grams",
            "fiber": "Amount in grams"
        },
        "micronutrients": {
            "vitamins": ["Present vitamins"],
            "minerals": ["Present minerals"]
        }
    },
    "healthInsights": {
        "nutritionalGaps": ["List of lacking nutrients and should we avoide or not"],
        "recommendations": {
            "foodSuggestions": ["Foods to add for balance"],
            "dietaryTips": ["Nutritionist recommendations"]
        },
        "healthBenefits": ["List of health benefits"],
        "cautionaryNotes": ["Any warnings or considerations"]
    }
}`;

const encodeImageToBase64 = (imagePath) => {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
};

export const getFoodDetail = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const genAI = new GoogleGenerativeAI(config.GenAI.apikey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageBase64 = encodeImageToBase64(req.file.path);
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: req.file.mimetype
            }
        };
        const result = await model.generateContent([
            analysisPrompt,
            imagePart
        ]);

        const response = await result.response;
        const analysisText = response.text();
        const cleanedText = analysisText.replace(/```json|\```/g, '').trim();
        
        try {
            const analysisJSON = JSON.parse(cleanedText);
            
            
            fs.unlinkSync(req.file.path);
            
            res.status(200).json(analysisJSON);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            res.status(500).json({
                error: 'Failed to parse analysis results',
                details: parseError.message,
                rawText: cleanedText
            });
        }

    } catch (error) {
        console.error('Error analyzing food image:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            error: 'Failed to analyze food image',
            details: error.message
        });
    }
};