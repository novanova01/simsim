import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  title: string;
  description: string;
  image?: string;
  questions: {
    question: string;
    options: { text: string; result: string }[];
  }[];
  createdAt: Date;
}

const TestSchema = new Schema<ITest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  questions: [
    {
      question: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          result: { type: String, required: true },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema); 