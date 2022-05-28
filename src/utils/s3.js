import 'dotenv/config';
import multer from 'multer';
import multerS3 from 'multer-S3';
import AWS from 'aws-sdk';
import path from 'path';

const { AWS_CONFIG_REGION, AWS_IDENTITYPOOLID } = process.env

const bucket = 'elice-team12'

AWS.config.update({
  region : AWS_CONFIG_REGION,
  credentials : new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITYPOOLID
  })
});

const s3 = new AWS.S3({
  apiVersion: "2012-10-17",
  params: {Bucket: bucket}
});

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: bucket, // 버킷 이름
      contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
      acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
      key: (req, file, cb) => {
          let extension = path.extname(file.originalname);
          cb(null, 'product_dummy/'+Date.now().toString()+extension);
          // cb(null, file.originalname)
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

export { upload };