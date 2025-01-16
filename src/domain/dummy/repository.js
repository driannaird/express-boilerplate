import prisma from "../../utils/prismaClient.js";

class DummyRepository {
  #generalOption = {
    include: {
      reffs: true,
    },
  };

  async findMany() {
    return await prisma.dummy.findMany(this.#generalOption);
  }

  async findUniqueId(id) {
    return await prisma.dummy.findFirst({
      where: {
        id,
      },
      ...this.#generalOption,
    });
  }

  async create(data) {
    return await prisma.dummy.create({
      data,
      ...this.#generalOption,
    });
  }

  async update(id, data) {
    return await prisma.dummy.update({
      where: {
        id,
      },
      data,
      ...this.#generalOption,
    });
  }

  async delete(id) {
    return await prisma.dummy.delete({
      where: {
        id,
      },
      ...this.#generalOption,
    });
  }
}

export default new DummyRepository();
