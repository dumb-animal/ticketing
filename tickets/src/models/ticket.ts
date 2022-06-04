import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    orderId: {
      type: mongoose.Types.ObjectId,
      default: undefined,
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticketAttrs: TicketAttrs) => {
  return new Ticket(ticketAttrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("ticket", ticketSchema);
export { Ticket };