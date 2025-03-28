import CardDetailStudent from ".";

export default {
  component: CardDetailStudent,
  tags: ["autodocs"],
  parameters: {},
};

export const WithValue = {
  args: {
    detailStudent: {
      nis: "123123123",
      name: "Cayla Cintia Azizah",
      address:
        "Jl. Metro Pondok Indah No.Kav. 4, RT.1/RW.16, Pd. Pinang, Kec. Kby. Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12310",
      imgProfile:
        "https://thumbs.dreamstime.com/b/child-girl-schoolgirl-elementary-school-student-123686003.jpg",
    },
    onClickEdit: () => {},
  },
};
