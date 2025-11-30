/**
 * custom defined types used in the app
 */
import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

/**
 * Type safety for the validated req added to the request
 */
export interface ValidatedRequest<T> extends Request {
  validatedData?: T;
  userData?: IUser;
  id?: string;
}

/**
 * custom Response with newValue and oldValue added to it
 */
export interface CustomResponse extends Response {
  newValue?: any;
  oldValue?: any;
}
