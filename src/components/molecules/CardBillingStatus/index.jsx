import { useMemo } from "react";
import PropTypes from "prop-types";

import Button from "@/components/atoms/Button";
import ColData from "@/components/atoms/ColData";
import LaunchIcon from "@/components/atoms/Icons/LaunchIcon";
import Paragraph from "@/components/atoms/Typography/Paragraph";
import convertMoney from "@/helpers/utils/convertMoney";

import StatusLabel from "../StatusLabel";

const CardBillingStatus = ({
  detailBilling = {
    billkey: "",
    semester: "",
    billName: "",
    studentClass: "",
    createdDate: "",
    endDate: "",
    amount: "",
    status: "",
  },
  onClickLaunch = () => {},
  onClickPay = () => {},
  loadingButtonPay = false,
}) => {
  const {
    amount,
    billName,
    billkey,
    createdDate,
    endDate,
    semester,
    status,
    studentClass,
  } = detailBilling;

  const statusBilling = useMemo(() => {
    switch (status) {
      case "lunas":
        return {
          status: "success",
          text: "Lunas",
        };
      case "cicil":
        return {
          status: "pending",
          text: "Cicil",
        };
      case "belum bayar":
        return {
          status: "failed",
          text: "Belum Dibayar",
        };
      default:
        return {
          status: "",
          text: "",
        };
    }
  }, [status]);

  return (
    <div className="w-full rounded-lg border border-neutral4 p-4">
      <div className="flex items-center justify-between">
        <Paragraph level={1} className="font-bold text-neutral10">
          Status Tagihan
        </Paragraph>

        <Paragraph level={1} className="font-bold text-blue6">
          {amount ? convertMoney(amount) : "Rp0"}
        </Paragraph>
      </div>

      <div className="my-4 grid grid-cols-2 gap-x-7 gap-y-[14px] break-all rounded bg-neutral3 p-4">
        <ColData label="Billkey" value={billkey} />
        <ColData label="Semester" value={semester} />
        <ColData label="Nama Tagihan" value={billName} />
        <ColData label="Kelas" value={studentClass} />
        <ColData label="Tanggal Dibuat" value={createdDate} />
        <ColData label="Tanggal Berakhir" value={endDate} />
      </div>

      <div>
        {status != "lunas" && billkey && (
          <Button
            className="mb-4 w-full"
            onClick={() => onClickPay(detailBilling)}
            isLoading={loadingButtonPay}
            data-testid="btn-pay-card-billing-status"
          >
            Bayar Sekarang
          </Button>
        )}

        <div className="h-1 w-full self-end bg-neutral3" />

        <div className="mt-4 flex items-center justify-between">
          <div
            className="flex cursor-pointer items-center gap-x-1"
            onClick={() => onClickLaunch(detailBilling)}
            data-testid="btn-detail-card-billing-status"
          >
            <Paragraph level={4} className="font-bold text-neutral8">
              Detail
            </Paragraph>

            <LaunchIcon />
          </div>
          <StatusLabel
            status={statusBilling.status}
            text={statusBilling.text}
          />
        </div>
      </div>
    </div>
  );
};

CardBillingStatus.propTypes = {
  detailBilling: PropTypes.shape({
    billkey: PropTypes.string,
    semester: PropTypes.string,
    billName: PropTypes.string,
    studentClass: PropTypes.string,
    createdDate: PropTypes.string,
    endDate: PropTypes.string,
    amount: PropTypes.string,
    status: PropTypes.string,
  }),
  onClickLaunch: PropTypes.func,
  onClickPay: PropTypes.func,
  loadingButtonPay: PropTypes.bool,
};

export default CardBillingStatus;
