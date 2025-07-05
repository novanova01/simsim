import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  testId: string;
  answers: number[];
  result: string;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  testId: { type: String, required: true },
  answers: [{ type: Number, required: true }],
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema); 