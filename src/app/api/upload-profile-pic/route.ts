'use server';

import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profilePic') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pics');
    const filePath = path.join(uploadDir, filename);

    // Ensure the directory exists (writeFile will create it if it doesn't)
    // However, for robustness, explicitly creating it can prevent issues if writeFile fails to create parent dirs
    // For this simple case, writeFile is usually sufficient.

    await writeFile(filePath, buffer);

    const publicPath = `/uploads/profile-pics/${filename}`;
    return NextResponse.json({ url: publicPath }, { status: 200 });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ message: 'Failed to upload profile picture' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', url);
    await unlink(filePath);

    return NextResponse.json({ message: 'Profile picture deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return NextResponse.json({ message: 'Failed to delete profile picture' }, { status: 500 });
  }
}
