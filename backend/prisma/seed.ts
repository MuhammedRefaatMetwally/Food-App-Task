import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@food.com' },
    update: {},
    create: {
      email: 'admin@food.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const burgers = await prisma.category.upsert({
    where: { id: 'cat-burgers' },
    update: {},
    create: { id: 'cat-burgers', nameEn: 'Burgers', nameAr: 'برجر' },
  });
  const pizza = await prisma.category.upsert({
    where: { id: 'cat-pizza' },
    update: {},
    create: { id: 'cat-pizza', nameEn: 'Pizza', nameAr: 'بيتزا' },
  });
  const drinks = await prisma.category.upsert({
    where: { id: 'cat-drinks' },
    update: {},
    create: { id: 'cat-drinks', nameEn: 'Drinks', nameAr: 'مشروبات' },
  });

  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        nameEn: 'Classic Burger', nameAr: 'برجر كلاسيك',
        descEn: 'Beef patty with lettuce, tomato and cheese',
        descAr: 'شريحة لحم مع خس وطماطم وجبن',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        categoryId: burgers.id,
      },
      {
        nameEn: 'Double Cheese Burger', nameAr: 'دبل تشيز برجر',
        descEn: 'Double beef patty with extra cheese',
        descAr: 'شريحتا لحم مع جبن مضاعف',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400',
        categoryId: burgers.id,
      },
      {
        nameEn: 'Margherita Pizza', nameAr: 'بيتزا مارغريتا',
        descEn: 'Classic tomato sauce with mozzarella',
        descAr: 'صلصة طماطم مع موزاريلا',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        categoryId: pizza.id,
      },
      {
        nameEn: 'Pepperoni Pizza', nameAr: 'بيتزا بيبروني',
        descEn: 'Loaded with pepperoni slices',
        descAr: 'محملة بشرائح البيبروني',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        categoryId: pizza.id,
      },
      {
        nameEn: 'Fresh Lemonade', nameAr: 'عصير ليمون طازج',
        descEn: 'Cold squeezed lemonade',
        descAr: 'عصير ليمون بارد طازج',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
        categoryId: drinks.id,
      },
    ],
  });

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());