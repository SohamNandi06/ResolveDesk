import mongoose, { Schema, Model } from 'mongoose';

// 1. Define the TypeScript Interface
export interface IComplaint {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dateSubmitted: Date;
  userName: string; // <--- Explicitly defined here
}

// 2. Define the Schema (Generics <IComplaint> connects the schema to the interface)
const ComplaintSchema = new Schema<IComplaint>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  dateSubmitted: { type: Date, default: Date.now },
  userName: { type: String, default: 'Anonymous' }, // <--- Mongoose Field
});

// 3. Create the Model (With type casting for Next.js hot-reloading)
const Complaint = 
  (mongoose.models.Complaint as Model<IComplaint>) || 
  mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;