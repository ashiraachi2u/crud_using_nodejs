import express from 'express';
import userRoutes from './routes/userRoutes.js';

const PORT = 5000; 
const app = express();
app.use(express.json());
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});