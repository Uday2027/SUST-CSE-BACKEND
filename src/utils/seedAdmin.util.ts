import { User } from '../modules/user/user.schema';
import { UserRole } from '../modules/user/user.types';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@sust.edu';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      return;
    }

    const adminData = {
      name: 'Super Admin',
      email: adminEmail,
      password: 'adminpassword123',
      phone: '01711111111',
      role: UserRole.ADMIN,
      status: 'ACTIVE',
    };

    await User.create(adminData);
    console.log('✅ Admin user seeded successfully! (admin@sust.edu)');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};
