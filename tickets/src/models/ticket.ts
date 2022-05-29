import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  creadtedAt: Date;
};

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(ticketAttrs: TicketAttrs): TicketDocument;
};

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
      }
    }
  }
);

ticketSchema.statics.build = (ticketAttrs: TicketAttrs) => {
  return new Ticket(ticketAttrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("ticket", ticketSchema);
export { Ticket };