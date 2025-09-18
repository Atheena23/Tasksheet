const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()
const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));

const taskSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    age:{
        type: Number,
        required: true,
        min:1,
        max:100
    },
    course:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    status:{
        type: String,
        default:"active"
    }
});
const TaskSlot = mongoose.model("TaskSlot",taskSchema);

app.post('/api/students',(req,res)=>{
    const {name,age,course,year} = req.body;

    if (!name||course==null||!year||!age){
        return res.status(400).json({message: "Name, Age, Course and Year is required"})
    }

    const taskItem = new TaskSlot({ name,course,year,age});
    taskItem.save()
    .then(savedItem => {
        res.status(201).json({message: "Item added successfully", item: savedItem})
    })
    .catch(err => {
        res.status(500).json({message: "Error adding item",error: err.message});
    });
});

app.get('/api/students', (req, res) => {
  TaskSlot.find()
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching items", error: err.message });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));