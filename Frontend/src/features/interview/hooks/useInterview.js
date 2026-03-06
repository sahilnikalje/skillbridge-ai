import { useContext, useEffect } from 'react'
import {getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf} from '../services/interview.api'
import { InterviewContext } from '../interview.context'
import { useParams } from 'react-router';

export const useInterview=()=>{
    const context=useContext(InterviewContext)
    const{interviewId}=useParams()
    
    if(!context){
        throw new Error("useInterview must be used withing an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports}=context

const generateReport=async({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        let response=null
        try{
             response=await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
        }
        catch(err){
            console.log("generateReportErr: ", err.message)
        }
        finally{
            setLoading(false)
        }
        return response?.interviewReport
}


 const getReportById=async(interviewId)=>{
    setLoading(true)
    let response=null
    try{
        response=await getInterviewReportById(interviewId)
        setReport(response.interviewReport)
    }
    catch(err){
        console.log("getreportbyIdErr: ", err.message)
    }
    finally{
        setLoading(false)
    }
    return response?.interviewReport
}

 const getReports=async()=>{
    setLoading(true)
    let response=null
    try{
         response=await getAllInterviewReports()
        setReports(response.interviewReports)
    }
    catch(err){
        console.log('getreportsErr: ', err.message)
    }
    finally{
        setLoading(false)
    }
    return response?.interviewReports
}

const getResumePdf=async(interviewReportId)=>{
    setLoading(true)
    let response=null
    try{
        response=await generateResumePdf({interviewReportId})
        const url=window.URL.createObjectURL(new Blob([response], {type:"application/pdf"}))
        const link=document.createElement("a")

        link.href=url
        link.setAttribute("download", `resume_${interviewReportId}.pdf`)
        document.body.appendChild(link)
        link.click()
    }
    catch(err){
        console.log("getResumePdfErr: ", err.message)
    }
    finally{
        setLoading(false)
    }
}
    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }
        else{
            getReports()
        }
    },[interviewId])

return {loading, report, reports, generateReport, getReportById, getReports, getResumePdf}
}