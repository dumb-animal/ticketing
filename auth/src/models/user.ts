import mongoose from "mongoose";

import { Password } from "../utils/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Не очень хорошая идея. Лучше это делать на уровне представления, а не на уровне модели
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    },
  }
);

// MIDDLEWARE
schema.pre("save", async function (done) {
  if (this.isModified("password")) {
    this.set("password", await Password.toHash(this.get("password")));
  }
  done();
});

// STATIC METHODS
schema.statics.build = (Attr: UserAttrs) => {
  return new User(Attr);
};

// EXPORT
const User = mongoose.model<UserDocument, UserModel>("User", schema);
export { User };
