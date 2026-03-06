const Groq = require('groq-sdk')
const { z } = require('zod')
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const MODEL = "llama-3.3-70b-versatile"

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The behavioural question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioural questions that can be asked in the interview along with their intention and how to answer them"),
    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("How important is this skill for the job")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate"),
    title: z.string().describe("The job title for which this interview report is generated, e.g. 'MERN Stack Developer'"),
})

const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    const schema = zodToJsonSchema(interviewReportSchema)

    const prompt = `You are an expert interview coach. Analyze the candidate's resume and job description, then generate a structured interview report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT: Your response must be a JSON object with EXACTLY these fields and no others:
- matchScore (number 0-100)
- technicalQuestions (array of objects with: question, intention, answer) — generate MINIMUM 8 questions
- behaviouralQuestions (array of objects with: question, intention, answer) — generate MINIMUM 6 questions
- skillGap (array of objects with: skill, severity ["low"|"medium"|"high"]) — generate MINIMUM 5 skill gaps
- preparationPlan (array of objects with: day, focus, tasks[]) — generate a MINIMUM 7 day plan, each day must have at least 3 tasks
- title (string — the job title from the job description)

JSON Schema to follow strictly:
${JSON.stringify(schema, null, 2)}

Return ONLY the JSON object. No explanation, no markdown, no code blocks, no extra fields.`

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are an expert interview coach. Always respond with valid JSON only. Follow the schema exactly. Do not add extra fields."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
    })

    return JSON.parse(response.choices[0].message.content)
}

const generatePdfFromHtml = async (htmlContent) => {
    console.log("Launching puppeteer...")
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ]
    })

    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded", timeout: 10000 })

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            },
            printBackground: true
        })

        console.log("PDF generated successfully, size:", pdfBuffer.length)
        return pdfBuffer
    } finally {
        await browser.close()
    }
}

const generateResumePdf = async ({ resume, jobDescription, selfDescription }) => {
    const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                    Respond with a JSON object with a single field "html" containing the full HTML content of the resume.
                    The resume should be tailored for the given job description and highlight the candidate's strengths and relevant experience.
                    The HTML content should be well-formatted, structured, and visually appealing.
                    The content should NOT sound AI-generated and should read like a real human-written resume.
                    You can use colors or different font styles but keep the overall design simple and professional.
                    The resume must be ATS-friendly, easily parsable without losing important information.
                    Keep it concise — ideally 1-2 pages when converted to PDF. Focus on quality over quantity.

                    Return ONLY the JSON object like: { "html": "<html>...</html>" }
                    No explanation, no markdown, no code blocks.`

    console.log("Calling Groq for resume HTML...")
    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are an expert resume writer. Always respond with valid JSON only, no extra text."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
    })

    const rawContent = response.choices[0].message.content
    console.log("Groq resume response received, length:", rawContent.length)

    const jsonContent = JSON.parse(rawContent)

    if (!jsonContent.html) {
        throw new Error("Groq did not return an 'html' field in resume response")
    }

    console.log("HTML content length:", jsonContent.html.length)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }