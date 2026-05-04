import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()


async function main() {
  const zonas = ['A', 'B', 'C']
  const capacidades = [2, 4, 6, 2, 4]


  for (const zona of zonas) {
    for (let i = 0; i < 5; i++) {
      const id = `${zona}${i + 1}`
      await prisma.table.upsert({
        where: { id },
        update: {},
        create: {
          id,
          zone: zona,
          capacity: capacidades[i],
          state: 'FREE',
        },
      })
    }
  }


  console.log('✅ 15 mesas creadas: Zonas A, B, C — 5 mesas por zona')
}


main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())