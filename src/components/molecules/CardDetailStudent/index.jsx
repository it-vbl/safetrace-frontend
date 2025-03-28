import PropTypes from "prop-types";

import Button from "@/components/atoms/Button";
import ColData from "@/components/atoms/ColData";
import Edit from "@/components/atoms/Icons/Edit";
import LaunchIcon from "@/components/atoms/Icons/LaunchIcon";
import RowData from "@/components/atoms/RowData";
import Paragraph from "@/components/atoms/Typography/Paragraph";

import StatusLabel from "../StatusLabel";

const CardDetailStudent = ({
  detailStudent = {
    nis: "",
    name: "",
    address: "",
    imgProfile: "",
    status: "",
  },
  onClickEdit = () => {},
  onClickDetail = () => {},
}) => {
  const { nis, address, imgProfile, name, status } = detailStudent;

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <div className="size-28 shrink-0 overflow-hidden rounded-full border-2 border-neutral4">
          <img
            alt="Profile Image"
            src={imgProfile}
            className="size-full object-cover"
          />
        </div>
        <div className="flex w-full flex-col gap-y-3 break-all rounded bg-neutral3 p-4">
          <ColData label="Nis" value={nis} />
          <ColData label="Nama Lengkap" value={name} />
          <RowData
            label="Status"
            value={
              status ? (
                <StatusLabel status={status.toLowerCase()} text={status} />
              ) : (
                "-"
              )
            }
          />
        </div>
      </div>

      <div className="">
        <Paragraph level={4} className="text-neutral8">
          Alamat
        </Paragraph>

        <Paragraph level={4} className="mt-2 break-all font-bold text-neutral9">
          {address || "-"}
        </Paragraph>
      </div>

      <div className="flex items-center gap-x-4">
        <Button
          variant="tertiary"
          onClick={onClickDetail}
          data-testid="btn-detail-card-detail-student"
        >
          <Paragraph level={2} className="mr-1">
            Detail
          </Paragraph>
          <LaunchIcon size={20} color="#454545" />
        </Button>
        <Button
          icon={<Edit size={20} />}
          className="w-full"
          onClick={onClickEdit}
          variant="secondary"
          data-testid="btn-edit-card-detail-student"
        >
          <Paragraph level={2}>Edit Data Siswa</Paragraph>
        </Button>
      </div>
    </div>
  );
};

CardDetailStudent.propTypes = {
  detailStudent: {
    nis: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    imgProfile: PropTypes.string,
  },
  onClickEdit: PropTypes.func,
};

export default CardDetailStudent;
