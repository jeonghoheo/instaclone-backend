import AWS from "aws-sdk";
import { FileUpload } from "graphql-upload";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRETY_KEY
  }
});

export const uploadToS3 = async (
  file: FileUpload,
  userId: number,
  folderName: string
) => {
  console.log(file, userId, folderName);
  const { filename, createReadStream } = await file;
  console.log(filename, createReadStream);
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
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
