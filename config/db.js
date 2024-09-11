const mongoose=require('mongoose')

const connectDb=async()=>{
    const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongoDb connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports=connectDb