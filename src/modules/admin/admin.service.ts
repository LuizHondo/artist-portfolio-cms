import prisma from '../../database/client.js';
import { comparePasswords, hashPassword, generateToken } from '../../shared/auth.js';
import { ChangePasswordInput } from '../../shared/schemas.js';

export class AdminService {
  async login(email: string, password: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error('Admin user not found');
    }

    const isPasswordValid = await comparePasswords(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = generateToken(admin.id, admin.email);

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async changePassword(adminId: string, data: ChangePasswordInput) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new Error('Admin user not found');
    }

    const isCurrentPasswordValid = await comparePasswords(data.currentPassword, admin.password);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.adminUser.update({
      where: { id: adminId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  async getAdminProfile(adminId: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new Error('Admin user not found');
    }

    return {
      id: admin.id,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }
}

export default new AdminService();
