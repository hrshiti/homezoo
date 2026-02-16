import mongoose from 'mongoose';

const reelLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reel',
      required: true,
    },
  },
  { timestamps: true }
);

reelLikeSchema.index({ user: 1, reel: 1 }, { unique: true });
reelLikeSchema.index({ reel: 1 });

const ReelLike = mongoose.model('ReelLike', reelLikeSchema);
export default ReelLike;
