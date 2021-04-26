import AWS from "aws-sdk";
import { FileUpload } from "graphql-upload";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRETY_KEY
  }
});

export const uploadPhoto = async (file: FileUpload, userId: number) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "choco-instaclone-uploader",
      Key: objectName,
      ACL: "public-read",
      Body: readStream
    })
    .promise();
  return Location;
};
