export const getAllPasien = (req, res) => {
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
  return res.status(200).json({
    message: "Success get all pasien",
    datas: dummyDataPasien,
  });
};

export const getPasienById = (req, res) => {
  console.log("uhuy");
};

export const createPasien = (req, res) => {
  console.log("hehehe");
};

export const updatePasien = (req, res) => {
  console.log("lksjdfdsf");
};

export const deletePasien = (req, res) => {
  console.log("Asoy");
};
