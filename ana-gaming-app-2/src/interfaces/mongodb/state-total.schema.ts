import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'state_totals' })
export class StateTotalDocument extends Document {
  @Prop({ required: true, unique: true })
  state: string;

  @Prop({ required: true, default: 0 })
  totalPeople: number;
}

export const StateTotalSchema = SchemaFactory.createForClass(StateTotalDocument);
