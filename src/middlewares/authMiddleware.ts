import {NextFunction, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {JWT_ACCESS_SECRET_KEY} from '../config';
import {HttpException} from '../exceptions/HttpException';
import {DataStoredInToken, RequestWithUser} from '../components/auth/auth/authInterface';
import {logger} from '../utils/logger';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] ||
        (
            req.header('Authorization') ?
                req.header('Authorization').split('Bearer ')[1] :
                null
        );
    if (Authorization) {
      req.user = (await verify(Authorization, JWT_ACCESS_SECRET_KEY)) as DataStoredInToken;
      next();
    } else {
      next(HttpException.unauthorized('Authentication token missing'));
    }
  } catch (error) {
    next(HttpException.unauthorized('Wrong authentication token'));
  }
};

export default authMiddleware;
