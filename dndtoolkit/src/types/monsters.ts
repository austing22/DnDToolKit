import { ObjectId } from "mongodb";

export interface Monster {
  _id?: ObjectId;
  name: string;
  XP: number | string;
  statBlock: string;
  image: string;
}
