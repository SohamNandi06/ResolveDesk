import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: 'Product' | 'Service' | 'Support';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  dateSubmitted: Date;
}

const ComplaintSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Product', 'Service', 'Support'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  dateSubmitted: { type: Date, default: Date.now },
});

// Prevent model overwrite error in Next.js
const Complaint: Model<IComplaint> = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;