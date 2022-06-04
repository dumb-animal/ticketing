import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
};

export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>
};

export interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
  findPrevVersion(event: { id: string, version: number }): Promise<TicketDocument | null>
};

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created
      ]
    }
  });

  return !!existingOrder;
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, ...fields } = attrs;
  return new Ticket({ _id: id, ...fields });
};

ticketSchema.statics.findPrevVersion = async (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

const Ticket = mongoose.model<TicketDocument, TicketModel>("ticket", ticketSchema);
export default Ticket;