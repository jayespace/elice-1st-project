// original code
// const AWS = require('aws-sdk');
// var multer = require("multer");
// var multerS3 = require("multer-s3");
// const path = require("path");
// const dotenv = require('dotenv') 
// dotenv.config()

import 'dotenv/config';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';


const { AWS_config_region, AWS_IDENTITYPOOLID } = process.env;

const bucket = 'elice-team12';

AWS.config.update({
  region : AWS_config_region,
  credentials : new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITYPOOLID
})
})

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {Bucket: bucket}
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: "public-read",
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname)
      cb(null, 'profileimage/'+Date.now().toString()+extension);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 용량 제한
});


export { upload };
