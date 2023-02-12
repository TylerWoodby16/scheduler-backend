import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";

const test = () => {
  const s3: S3Client = new S3Client({
    region: "us-east-1",
  });
};
