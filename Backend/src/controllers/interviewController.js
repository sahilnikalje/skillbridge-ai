const {PDFParse}=require('pdf-parse')

const parsePdf=(buffer)=>{
    const parser=new PDFParse({data:buffer})
    return parser.getText()
}
const {generateInterviewReport, generateResumePdf}=require('../services/ai.service')
const InterviewReport=require('../models/interviewReportModel')

const generateInterviewReportController=async(req,res)=>{
    
    try{
        const MAX_SIZE_BYTES = 100 * 1024 // 100KB
        if (req.file.size > MAX_SIZE_BYTES) {
          return res.status(400).json({ success: false, error: "Resume file is too large. Max allowed size is 100KB." })
        }
        
        const resumeContent=await parsePdf(req.file.buffer)
        const resumeText=resumeContent.text
        const {selfDescription, jobDescription}=req.body

        const jobDescriptionString=typeof jobDescription==="object"
            ? JSON.stringify(jobDescription)
            : jobDescription

        const interviewReportByAi=await generateInterviewReport({
            resume:resumeText,
            selfDescription,
            jobDescription:jobDescriptionString,
        })
        console.log("AI RESPONSE:", JSON.stringify(interviewReportByAi, null, 2))

        const interviewReport=await InterviewReport.create({
            ...interviewReportByAi,
            user:req.user.id,
            resume:resumeText,
            selfDescription,
            jobDescription:jobDescriptionString,
            title:interviewReportByAi.title || "Interview Report",
        })

        res.status(201).json({success:true, message:"Interview report generated successfully", interviewReport})
    }
    catch(err){
        console.error("generateInterviewReportController ERROR:", err)
        res.status(500).json({success:false, error: err.message})
    }
}

const getInterviewReportByIdController=async(req,res)=>{
    const{interviewId}=req.params
    const interviewReport=await InterviewReport.findOne({_id:interviewId, user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({success:false, message:"Interview report not found"})
    }

    res.status(200).json({success:true, message:"Interview report fetched successfully", interviewReport})
}

const getAllInterviewReportsController=async(req,res)=>{
    const interviewReports=await InterviewReport.find({user:req.user.id})
                        .sort({createdAt:-1})
                        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGap -preparationPlan")
    res.status(200).json({success:true, message:"Interview reports fetched successfully", interviewReports})
}

const generateResumePdfController=async(req,res)=>{
    try{
        const{interviewReportId}=req.params
        const interviewReport=await InterviewReport.findById(interviewReportId)

        if(!interviewReport){
            return res.status(404).json({success:false, message:"Interview report not found"})
        }

        const{resume, jobDescription, selfDescription}=interviewReport
        console.log("Generating resume PDF for report:", interviewReportId)

        const pdfBuffer=await generateResumePdf({resume, jobDescription, selfDescription})

        res.set({
            "Content-Type":"application/pdf",
            "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
        })
        res.send(pdfBuffer)
    }
    catch(err){
        // log the full stack so we can see exactly where it crashes
        console.error("generateResumePdfController ERROR:", err)
        res.status(500).json({success:false, error: err.message})
    }
}

module.exports={generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}