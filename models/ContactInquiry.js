import mongoose from 'mongoose';

const ContactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    product_interest: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      required: true
    }
    // ,
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // }
  },
  { timestamps: true }
);

export default mongoose.model('ContactInquiry', ContactInquirySchema);
