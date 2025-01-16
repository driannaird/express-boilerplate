import prisma from "../../utils/prismaClient";
import { createDummyType, updateDummyType } from "./types";

class DummyRepository {
  private generalOption = {
    include: {
      reffs: true,
    },
  };

  async findMany() {
    return await prisma.dummy.findMany();
  }

  async findUniqueId(id: string) {
    return await prisma.dummy.findFirst({
      where: {
        id,
      },
      ...this.generalOption,
    });
  }

  async create(data: createDummyType) {
    return await prisma.dummy.create({
      data,
      ...this.generalOption,
    });
  }

  async update(id: string, data: updateDummyType) {
    return await prisma.dummy.update({
      where: {
        id,
      },
      data,
      ...this.generalOption,
    });
  }

  async delete(id: string) {
    return await prisma.dummy.delete({
      where: {
        id,
      },
      ...this.generalOption,
    });
  }
}

export default new DummyRepository();
