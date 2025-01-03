import { Request, Response } from "express";

export const getAllPasien = (req: Request, res: Response) => {
  const dummyDataPasien = [
    {
      nomor_rekam_medis: "071004",
      nama_pasien: "Riski Drian Pratama",
      nomor_ktp: "33030322202033",
      jenis_kelamin: "L",
      tempat_lahir: "Purbalingga",
      tanggal_lahir: "22/12/2004",
      alamat: "Kadang Kiding",
      golongan_darah: "O",
      pekerjaan: "CEO",
      status_pernikahan: "SINGLE",
      agama: "ISLAM",
      tanggal_daftar: "01/01/2025",
      nomor_telepon: "082232929829",
    },
    {
      nomor_rekam_medis: "221204",
      nama_pasien: "Malio Boro",
      nomor_ktp: "33030322202033",
      jenis_kelamin: "L",
      tempat_lahir: "Purbalingga",
      tanggal_lahir: "22/12/2004",
      alamat: "Kadang Kiding",
      golongan_darah: "O",
      pekerjaan: "CEO",
      status_pernikahan: "SINGLE",
      agama: "ISLAM",
      tanggal_daftar: "01/01/2025",
      nomor_telepon: "082232929829",
    },
  ];

  res.status(200).json({
    message: "Success get all pasien",
    datas: dummyDataPasien,
  });
};

export const getPasienById = (req: Request, res: Response) => {
  console.log("uhuy");
};

export const createPasien = (req: Request, res: Response) => {
  console.log("hehehe");
};

export const updatePasien = (req: Request, res: Response) => {
  console.log("lksjdfdsf");
};

export const deletePasien = (req: Request, res: Response) => {
  console.log("Asoy");
};
