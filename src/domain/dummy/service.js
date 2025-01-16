import DummyRepository from "./repository.js";

export const getAllDummyService = async () => {
  return await DummyRepository.findMany();
};

export const getDummyByUniqueIdService = async (id) => {
  return await DummyRepository.findUniqueId(id);
};

export const createDummyService = async (data) => {
  return await DummyRepository.create(data);
};

export const updateDummyService = async (id, data) => {
  return await DummyRepository.update(id, data);
};

export const deleteDummyService = async (id) => {
  return await DummyRepository.delete(id);
};
