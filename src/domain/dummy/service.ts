import DummyRepository from "./repository";
import { createDummyType, updateDummyType } from "./types";

export const getAllDummyService = async () => {
  return await DummyRepository.findMany();
};

export const getDummyByUniqueIdService = async (id: string) => {
  return await DummyRepository.findUniqueId(id);
};

export const createDummyService = async (data: createDummyType) => {
  return await DummyRepository.create(data);
};

export const updateDummyService = async (id: string, data: updateDummyType) => {
  return await DummyRepository.update(id, data);
};

export const deleteDummyService = async (id: string) => {
  return await DummyRepository.delete(id);
};
