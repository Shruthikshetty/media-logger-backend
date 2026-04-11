"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscoverItems = exports.buildMediaEnrichment = void 0;
const pagination_1 = require("./pagination");
const handle_error_1 = require("./handle-error");
//helper to build the look up pipeline stage for discover media
const buildMediaEnrichment = (userId, onModel) => {
    if (!userId || !onModel)
        return [];
    //if user is logged in generate media entry details
    return [
        {
            $lookup: {
                from: 'mediaentries',
                let: { mediaId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$user', userId] },
                                    { $eq: ['$onModel', onModel] },
                                    { $eq: ['$mediaItem', '$$mediaId'] },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            user: 1,
                            onModel: 1,
                            status: 1,
                            rating: 1,
                        },
                    },
                ],
                as: 'mediaEntry',
            },
        },
        {
            $addFields: {
                mediaEntry: {
                    $cond: {
                        // Check if the array has items
                        if: { $gt: [{ $size: '$mediaEntry' }, 0] },
                        // If YES: take the first item
                        then: { $arrayElemAt: ['$mediaEntry', 0] },
                        // If NO: explicitly set to null
                        else: null,
                    },
                },
            },
        },
    ];
};
exports.buildMediaEnrichment = buildMediaEnrichment;
/**
 * A helper function to get discover items of a particular media type
 *
 * @param {ValidatedRequest<null>} req - The express request object
 * @param {Response} res - The express response object
 * @param {Object} options - The options object containing the following properties
 * @param {Model<any>} options.MediaModel - The mongoose model for the media type
 * @param {MediaEntryModelType} options.onModel - The type of the media item to discover
 * @param {string} options.mediaKey - The key to use for the media items in the response
 * @param {PaginationLimits} options.limits - The pagination limits object
 */
const getDiscoverItems = async (req, res, options) => {
    try {
        //get user id if exists
        const userId = req?.userData?._id;
        //generate pagination
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, options.limits);
        //define a pipeline
        const pipeline = [
            { $sort: { createdAt: -1 } },
            { $skip: start },
            { $limit: limit },
            ...(0, exports.buildMediaEnrichment)(userId, options.onModel),
        ];
        // execute pipeline
        const [data, total] = await Promise.all([
            options.MediaModel.aggregate(pipeline),
            options.MediaModel.countDocuments(),
        ]);
        //return response
        res.status(200).json({
            success: true,
            data: {
                [options.mediaKey]: data,
                pagination: (0, pagination_1.getPaginationResponse)(total, limit, start),
            },
        });
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getDiscoverItems = getDiscoverItems;
