import { Prisma, UserRole } from "@prisma/client";
import prisma from "../../utils/prismaClient";

class UserRepository {
  private generalSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    lastLogin: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.userSelect;

  async countAll() {
    return await prisma.user.count();
  }

  async count(search: string) {
    const where: Prisma.userWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    return await prisma.user.count({ where });
  }

  async findMany(
    search: string,
    skip: number,
    take: number,
    sort?: "asc" | "desc" | "last-login"
  ) {
    const where: Prisma.userWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    let orderBy: Prisma.userOrderByWithRelationInput = { updatedAt: "desc" };

    if (sort === "asc") {
      orderBy = { name: "asc" };
    } else if (sort === "desc") {
      orderBy = { name: "desc" };
    } else if (sort === "last-login") {
      orderBy = { lastLogin: "desc" };
    }

    return await prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: this.generalSelect,
    });
  }

  async findUniqueId(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: this.generalSelect,
    });
  }

  async findUniqueIdWithPassword(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        ...this.generalSelect,
        password: true,
      },
    });
  }

  async findUniqueEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        ...this.generalSelect,
        password: true,
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    return await prisma.user.create({
      data,
      select: this.generalSelect,
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      role: UserRole;
      lastLogin: Date;
    }>
  ) {
    return await prisma.user.update({
      where: { id },
      data,
      select: this.generalSelect,
    });
  }

  async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
      select: this.generalSelect,
    });
  }
}

export default new UserRepository();
