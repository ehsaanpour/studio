import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    console.log('Received password change request:', { currentPassword, newPassword });

    const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');
    console.log('Users file path:', usersFilePath);

    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    console.log('Users data read from file:', usersData);
    const users = JSON.parse(usersData);

    const adminUserIndex = users.findIndex((user: any) => user.username === 'admin');
    console.log('Admin user index:', adminUserIndex);

    if (adminUserIndex === -1) {
      console.log('Admin user not found.');
      return NextResponse.json({ message: 'Admin user not found' }, { status: 404 });
    }

    console.log('Current admin password in file:', users[adminUserIndex].password);
    if (users[adminUserIndex].password !== currentPassword) {
      console.log('Incorrect current password provided.');
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
    }

    users[adminUserIndex].password = newPassword;
    console.log('New admin password set in memory:', users[adminUserIndex].password);

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    console.log('Users file written successfully with new password.');

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
