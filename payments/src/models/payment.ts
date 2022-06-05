import mongoose from "mongoose";

export interface paymentAttrs {
  orderId: string;
  stripeId: string;
};

export interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
};

export interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(attrs: paymentAttrs): PaymentDocument;
};

// SCHEMA

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

paymentSchema.statics.build = (attrs: paymentAttrs) => {
  return new Payment(attrs);
}

export const Payment = mongoose.model<PaymentDocument, PaymentModel>("payment", paymentSchema);
