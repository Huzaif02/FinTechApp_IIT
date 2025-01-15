const mongoose = require('mongoose');
const Agent = require('./models/Agent/Agent'); // Adjust the path as needed

const updateAgentsSchema = async () => {
  try {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.wunlw.mongodb.net/fintechapp?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Update all agents to include the `usersReferred` field if missing
    const result = await Agent.updateMany(
      { usersReferred: { $exists: false } }, // Find agents without the `usersReferred` field
      { $set: { usersReferred: [] } }       // Add the field with a default empty array
    );

    console.log(`Updated ${result.nModified} agent(s).`);

    // Close the database connection
    await mongoose.disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error updating agents:', error.message);
  }
};

updateAgentsSchema();
