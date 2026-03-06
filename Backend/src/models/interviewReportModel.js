const mongoose=require('mongoose')

//**sub schemas created to avoid confusion */
const technicalQuestionSchema=new mongoose.Schema({
    question:{type:String, required:true},
    intention:{type:String, required:true},
    answer:{type:String, required:true}
},{
    //! we dont want to store the technical questions in the user id so id should be false
    _id:false
})

const behaviourialQuestionSchema=new mongoose.Schema({
    question:{type:String, required:true},
    intention:{type:String, required:true},
    answer:{type:String, required:true} 
},{
    _id:false
})

const skillGapSchema=new mongoose.Schema({
    skill:{type:String, required:true},
    severity:{type:String, enum:['low', 'medium', 'high']}
},{
    _id:false
})

const preparationPlanSchema=new mongoose.Schema({
    day:{type:Number, required:true},
    focus:{type:String, required:true},
    tasks:[{
        type:String, required:true
    }]
})

//**actual schema */
const interviewReportSchema=new mongoose.Schema({
    jobDescription:{type:String, required:true},
    resume:{type:String},
    selfDescription:{type:String},
    matchScore:{type:Number, min:0, max:100},
    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviourialQuestionSchema],
    skillGap:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    title:{type:String, required:true}
},{
    timestamps:true
})

module.exports=mongoose.model('InterviewReport', interviewReportSchema)