'use server';

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

const LIARA_S3_ENDPOINT = process.env.LIARA_S3_ENDPOINT;
const LIARA_S3_ACCESS_KEY_ID = process.env.LIARA_S3_ACCESS_KEY_ID;
const LIARA_S3_SECRET_ACCESS_KEY = process.env.LIARA_S3_SECRET_ACCESS_KEY;
const LIARA_S3_BUCKET_NAME = process.env.LIARA_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: 'us-east-1', // Liara might not have regions, but AWS SDK requires one. 'us-east-1' is a common default.
  endpoint: LIARA_S3_ENDPOINT,
  credentials: {
    accessKeyId: LIARA_S3_ACCESS_KEY_ID || '',
    secretAccessKey: LIARA_S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for some S3-compatible services like MinIO/Liara
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profilePic') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const key = `profile-pics/${filename}`; // S3 object key

    const uploadParams = {
      Bucket: LIARA_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: ObjectCannedACL.public_read, // Make the object publicly readable
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct the public URL for the uploaded file
    // Assuming Liara's public URL structure is like: [endpoint]/[bucket-name]/[key]
    const publicUrl = `${LIARA_S3_ENDPOINT}/${LIARA_S3_BUCKET_NAME}/${key}`;
    
    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('Error uploading profile picture to S3-compatible storage:', error);
    return NextResponse.json({ message: 'Failed to upload profile picture' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    // Extract the key from the URL
    // Assuming URL format: [endpoint]/[bucket-name]/profile-pics/[filename]
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf(LIARA_S3_BUCKET_NAME || '');
    let key = '';
    if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
      key = urlParts.slice(bucketIndex + 1).join('/');
    } else {
      // Fallback if bucket name not found in URL, try to parse directly from known path
      const publicUploadsPath = '/uploads/profile-pics/';
      const pathIndex = url.indexOf(publicUploadsPath);
      if (pathIndex !== -1) {
        key = url.substring(pathIndex + 1); // Remove leading slash to match S3 key format
      } else {
        // If all else fails, assume the URL is just the key relative to the bucket
        key = url.split('/').pop() || ''; // Get the last part of the URL as a fallback key
        if (key && !key.startsWith('profile-pics/')) {
          key = `profile-pics/${key}`; // Prepend if it's just the filename
        }
      }
    }

    if (!key) {
      return NextResponse.json({ message: 'Could not determine object key from URL' }, { status: 400 });
    }

    const deleteParams = {
      Bucket: LIARA_S3_BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return NextResponse.json({ message: 'Profile picture deleted successfully from S3-compatible storage' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting profile picture from S3-compatible storage:', error);
    return NextResponse.json({ message: 'Failed to delete profile picture' }, { status: 500 });
  }
}
