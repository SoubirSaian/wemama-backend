import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

//create token
export const createToken = (
  tokenPayload: object,
  secret: Secret,
  expireTime: SignOptions["expiresIn"]
) => {
  const token = jwt.sign(tokenPayload, secret, { expiresIn: expireTime });
  return token;
};

//verify token
export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};





