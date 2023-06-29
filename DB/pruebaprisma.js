const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const new_state = await prisma.estado.create({
    data: 
    {
        nombre_estado: 'Nuevo Estado 2.0'
    }
  });
  const estados = await prisma.estado.findMany();
  console.log(estados);
  //console.log(new_state);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
