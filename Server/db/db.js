import mongoose from 'mongoose';



const mongoConnect = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log('Connected to database');
    }
    catch (err) {
        console.log(err);
    }
}

export default mongoConnect;