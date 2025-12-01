/**
 * @this file contains all the  controller's for media comments
 */

import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { AddMediaCommentSchemaType } from '../common/validation-schema/media-comment/add-comment';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

//controller to add a new comment
export const addMediaComment = async (
  req: ValidatedRequest<AddMediaCommentSchemaType>,
  res: Response
) => {
  try {
    const validatedData = req.validatedData!;
    //let's create a new comment
    const mockComment = {
      entityId: validatedData.entityId,
      entityType: validatedData.entityType,
      user: req.userData?.id ?? '',
      comment: validatedData.comment,
      username: req.userData?.name ?? '',
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
