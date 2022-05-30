import mongoose from "mongoose";
import { OrderStatus } from "@dumb-animal/common";

interface orderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  // ticket: TicketDocument;
};

interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  // ticket: TicketDocument;
};

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: orderAttrs): OrderDocument;
};

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: Date
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: "ticket"
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

orderSchema.statics.build = (attrs: orderAttrs) => {
  return new Order(attrs);
}

const Order = mongoose.model<OrderDocument, OrderModel>("order", orderSchema);
export default Order;