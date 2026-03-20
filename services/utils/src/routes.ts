import express from "express";
import cloudinary from "cloudinary";
const router = express.Router();
router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
    const cloud = await cloudinary.v2.uploader.upload(buffer, {
      resource_type: "auto",
    });
    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    (console.error("UPLOAD ERROR:", error),
      res.status(500).json({
        message: error.message,
      }));
  }
});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });
router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills) {
      return res.status(400).json({
        message: "Skills Required",
      });
    }
    const prompt = `
Based on the following skills: ${skills}.
Please act as a career advisor and generate a career path suggestion.
Your entire response must be in a valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:
{
"summary": "A brief, encouraging summary of the user's skill set and their general job
title.",
"jobOptions": [
{
"title": "The name of the job role.",
"responsibilities": "A description of what the user would do in this role.",
"why": "An explanation of why this role is a good fit for their skills."
}
],
"skillsToLearn": [
{
"category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack
Mastery', 'DevOps & Cloud').",
"skills": [
{
"title": "The name of the skill to learn.",
"why": "Why learning this skill is important.",
"how": "Specific examples of how to learn or apply this skill."
}
]
}
],
"learningApproach": {
"title": "How to Approach Learning",
"points": ["A bullet point list of actionable advice for learning."]
}
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    let jsonReponse;
    try {
      const rawText = response.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      if (!rawText) {
        throw new Error("Ai did not return a valid text response.");
      }
      jsonReponse = JSON.parse(rawText);
    } catch (error) {
      return res.status(500).json({
        message: "Ai resturned response that was not valid JSON",
        rawResponse: response.text,
      });
    }
    res.json(jsonReponse);
  } catch (error: any) {
    (console.error("UPLOAD ERROR:", error),
      res.status(500).json({
        message: error.message,
      }));
  }
});

router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ message: "Pdf data is required" });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume
and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance

Your entire response must be in valid JSON format. Do not include any text or markdown outside JSON.

{
  "atsScore": 85,
  "scoreBreakdown": {
    "formatting": { "score": 90, "feedback": "" },
    "keywords": { "score": 80, "feedback": "" },
    "structure": { "score": 85, "feedback": "" },
    "readability": { "score": 88, "feedback": "" }
  },
  "suggestions": [
    {
      "category": "",
      "issue": "",
      "recommendation": "",
      "priority": "high/medium/low"
    }
  ],
  "strengths": [],
  "summary": ""
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
              },
            },
          ],
        },
      ],
    });

    let jsonResponse;

    try {
      const rawText = response.text
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      if (!rawText) {
        throw new Error("AI did not return valid text");
      }

      jsonResponse = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: response.text,
      });
    }

    res.json(jsonResponse);
  } catch (error: any) {
    console.error("RESUME ANALYZER ERROR:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export default router;
