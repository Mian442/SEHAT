const mongoose = require("mongoose");
const Joi = require("joi");
var sess_; // global session, NOT recommended

const patientSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  title: String,
  age: Number,
  DOB: String,
  pic: String,
  Ph: Number,
  emailAddress: String,
  password: String

});
const PatientModel = mongoose.model("PatientDb", patientSchema);

// Its a static Method which can be called as Patient.doStuff();
patientSchema.statics.getPatientById = async function (PatientId) {
  // Validating if given user is in our List
  //const patient = patients.find(p => p.id === parseInt(PatientId));
  // If not existing, return 404
  return (patient = await PatientModel.findById(
    PatientId,
    function (err, patient) {
      if (err) return "Error 404 No patient with the given id in the record";
      else return patient;
    }
  ));
};

patientSchema.statics.getPatient = async function () {
  var result = [];
  const patient_Obj_Result = await PatientModel.find();
  patient_Obj_Result.forEach(function (doc, err) {
    result.push(doc);
  });
  console.log(result);
  return result;
};

patientSchema.statics.getPage = async function (page = 1, perPage = 10) {
  return this.find()
    .limit(perPage)
    .skip((page - 1) * perPage);
};

patientSchema.statics.validate = async function (RequestedBody) {
  //  Validating
  return validatePatient(RequestedBody);
};

patientSchema.statics.getPatientByEmailPasscode = async function (RequestedInformation){
  console.log("hello")
  const patientCredientials = await PatientModel.findOne({ 
    emailAddress: RequestedInformation.emailAddress,
    password: RequestedInformation.password 
  });  
  console.log(patientCredientials);
  sess_Id_ = patientCredientials._id;
  return patientCredientials;
};

//can be called on instance like. let p = new Patient(); p.doStuffOnSIngleRecord();
//dont use arrow functions here
patientSchema.methods.addPatient = async function (PatientName) {
  // Add patient
  const Patient_Obj = new PatientModel({
    fname: PatientName.fname,
    lname: PatientName.lname,
    title: PatientName.title,
    age: PatientName.age,
    DOB: PatientName.DOB,
    pic: PatientName.pic,
    Ph: PatientName.Ph,
    emailAddress: PatientName.emailAddress,
    password: PatientName.password
  });

  await Patient_Obj.save();
  var result = [];
  const product_Obj_Result = await PatientModel.find().sort( { _id : -1 } ).limit(1);;
  // product_Obj_Result.forEach(function (doc, err) {
  //   result.push(doc);
  // });
  return product_Obj_Result;
};

// patientSchema.virtual("annualSalary").get(function () {
//   return this.salary * 12;
// });

patientSchema.post("save", async (doc) => {
  //https://mongoosejs.com/docs/middleware.html
  //this method will be called when a save is successful on a single record
  
});

function validatePatient(patient) {
  // Designing JOI Validation schema
  const schema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    title: Joi.string().min(2).required(),
    age: Joi.number().required(),
    DOB: Joi.string().min(3).required(),
    pic: Joi.string().required(),
    Ph: Joi.number().required(),
    emailAddress: Joi.string().min(6).required(),
    password: Joi.string().min(5).required(),
  });
  // Returniing the resuslt
  return schema.validate(patient, { abortEarly: false });
}

patientSchema.set("toJSON", { virtuals: true });
const Model = mongoose.model("Patient", patientSchema);
module.exports = Model;
