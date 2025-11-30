/**
 * @this file contains all the  controller's for media comments
 */

import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import { ConvexHttpClient } from "convex/browser";
import { api } from '../convex/_generated/api';

const convex  = new ConvexHttpClient(process.env.CONVEX_URL!);

//controller to add a new comment
export const addMediaComment = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //let just mock add for testing @TODO
    const mockComment = {
      entityId: '69216c9826548e7ab0b684d4',
      entityType: 'Game',
      user: req.userData?.id ?? 'Anonymous',
      comment: 'Test comment ',
      username: req.userData?.name ?? 'Anonymous',
      profileImg: req.userData?.profileImg ?? '',
    };

    //call convex mutation!
    const commentId = await convex.mutation(
      api.services.comments.createMediaCommentMutation,
      mockComment
    );

    res.status(201).json({
      success: true,
      data: { commentId },
      message: 'Comment added successfully',
    });
  } catch (err) {
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
