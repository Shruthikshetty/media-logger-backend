/**
 * @file contains the validation schema for history filter
 */

import { z } from 'zod';
import { GET_ALL_HISTORY_LIMITS } from '../../constants/config.constants';
import {
  HISTORY_ACTION,
  HISTORY_ENTITY,
} from '../../constants/model.constants';

//schema
export const HistoryFilterZodSchema = z
  .object({
    action: z
      .string({
        message: 'Action must be string',
      })
      .refine((val) => HISTORY_ACTION.includes(val), {
        message: `Action must be one of the following: ${HISTORY_ACTION.join(
          ', '
        )}`,
      })
      .optional(),

    entityType: z
      .string({
        message: 'Entity type must be string',
      })
      .refine((val) => HISTORY_ENTITY.includes(val), {
        message: `Entity type must be one of the following: ${HISTORY_ENTITY.join(', ')}`,
      })
      .optional(),

    bulk: z
      .boolean({
        message: 'Bulk must be boolean',
      })
      .optional(),

    fullDetails: z
      .boolean({
        message: 'Full details must be boolean',
      })
      .default(false),

    limit: z
      .number({
        message: 'Limit must be number',
      })
      .int()
      .max(GET_ALL_HISTORY_LIMITS.limit.max)
      .min(GET_ALL_HISTORY_LIMITS.limit.min)
      .default(GET_ALL_HISTORY_LIMITS.limit.default),

    start: z
      .number({
        message: 'Start must be number',
      })
      .int()
      .min(GET_ALL_HISTORY_LIMITS.start.min)
      .default(GET_ALL_HISTORY_LIMITS.start.default),

    page: z
      .number({
        message: 'Page must be number',
      })
      .int()
      .min(1)
      .optional(),
  })
  .default({});

//export type
export type HistoryFilterZodType = z.infer<typeof HistoryFilterZodSchema>;
