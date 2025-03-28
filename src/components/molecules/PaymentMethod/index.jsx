import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Typography/Heading";
import Paragraph from "@/components/atoms/Typography/Paragraph";
import Modal from "@/components/molecules/Modal";
import convertMoney from "@/helpers/utils/convertMoney";
import useScreenSize from "@/helpers/utils/useScreenSize";

const PaymentMethod = ({
  visible,
  data,
  options = [],
  value,
  isLoading,
  onChange = () => {},
  onSubmit = () => {},
  onClose = () => {},
}) => {
  const [selectedMethod, setSelectedMethod] = useState(value);
  const { isMobile } = useScreenSize();

  useEffect(() => {
    setSelectedMethod(value);
  }, [value]);

  const handleChange = (e) => {
    setSelectedMethod(parseInt(e?.target?.value));
    onChange(parseInt(e?.target?.value));
  };

  const calculateAdminFee = (methodId) => {
    const config = options.find((cfg) => cfg.id === methodId);

    if (!config) return 0;

    const totalAmount =
      data?.billings?.reduce((sum, bill) => sum + bill.amount, 0) || 0;

    if (config?.isPercentage) {
      return (
        (totalAmount * parseFloat(config?.adminFeePercentage)) / 100 +
        config?.adminFee
      );
    }
    return config?.adminFee;
  };

  const adminFee = calculateAdminFee(selectedMethod);
  const totalAmount =
    data?.billings?.reduce((sum, bill) => sum + bill.amount, 0) || 0;

  const vaConfigs = options.filter((cfg) => cfg.paymentMethod === "VA");
  const otherConfigs = options.filter((cfg) => cfg.paymentMethod !== "VA");

  return (
    <Modal
      visible={visible}
      title="Pembayaran"
      onClose={onClose}
      customRightHeader={
        !isMobile && (
          <Button onClick={onSubmit} isLoading={isLoading}>
            Bayar
          </Button>
        )
      }
      isBottomSheet
      dataTestId="modal-payment-method"
    >
      <div className="flex flex-col gap-4">
        {/* MOBILE DETAIL */}
        <div className="flex flex-col gap-2 rounded bg-neutral3 p-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <Paragraph level={4} className="text-neutral8">
              Pembayaran
            </Paragraph>
            <Paragraph level={4} className="font-medium text-neutral8">
              {convertMoney(totalAmount)}
            </Paragraph>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Paragraph level={4} className="text-neutral8">
              Biaya Admin
            </Paragraph>
            <Paragraph level={4} className="font-medium text-neutral8">
              {convertMoney(adminFee)}
            </Paragraph>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Paragraph level={4} className="text-neutral8">
              Total Pembayaran
            </Paragraph>
            <Paragraph level={2} className="font-medium text-blue8">
              {convertMoney(totalAmount + adminFee)}
            </Paragraph>
          </div>
        </div>

        {/* DESKTOP DETAIL */}
        <div className="hidden flex-col gap-1 md:flex">
          <div className="flex items-center justify-between gap-3">
            <Paragraph
              level={3}
              className="text-neutral8"
              data-testid="payment-title"
            >
              Pembayaran
            </Paragraph>
            <Heading level={4} className="font-medium text-neutral8">
              {convertMoney(totalAmount)}
            </Heading>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Paragraph level={3} className="text-neutral8">
              Biaya Admin
            </Paragraph>
            <Heading level={4} className="font-medium text-neutral8">
              {convertMoney(adminFee)}
            </Heading>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Paragraph level={3} className="text-neutral8">
              Total Pembayaran
            </Paragraph>
            <Heading level={2} className="text-blue8">
              {convertMoney(totalAmount + adminFee)}
            </Heading>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-0 md:rounded-lg md:bg-neutral3 md:p-4">
          <div className="flex w-full items-center gap-2">
            <input
              type="radio"
              id="VA"
              name="VA"
              value={vaConfigs[0]?.id}
              checked={vaConfigs.some((cfg) => cfg.id === selectedMethod)}
              onChange={handleChange}
              className="size-4 accent-blue8"
            />
            <label
              htmlFor="VA"
              className="flex w-full cursor-pointer items-center gap-2"
            >
              <Paragraph
                level={isMobile ? 3 : 2}
                className="text-neutral9 md:text-neutral10"
              >
                Virtual Account
              </Paragraph>
            </label>
          </div>

          {vaConfigs.some((cfg) => cfg.id === selectedMethod) && (
            <div className="flex flex-col gap-3 pl-8">
              <Paragraph level={3} className="text-[#656263]">
                Pilih Bank untuk transfer
              </Paragraph>
              {vaConfigs.map((bank) => (
                <div key={bank.bankCode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={bank.id}
                    name="paymentMethod"
                    value={bank.id}
                    checked={selectedMethod === bank.id}
                    onChange={handleChange}
                    className="size-4 accent-blue8"
                  />
                  <label
                    htmlFor={bank.id}
                    className="flex w-full cursor-pointer items-center gap-3"
                  >
                    <img
                      src={bank.methodLogo || "/default-image.png"}
                      alt={`${bank.bankName} Logo`}
                      className="h-4 w-auto object-contain"
                      onError={(e) => {
                        if (e.target.src !== "") {
                          e.target.style.display = "none";
                        }
                      }}
                    />
                    <Paragraph level={isMobile ? 3 : 2}>
                      {bank.bankName}
                    </Paragraph>
                  </label>
                </div>
              ))}
            </div>
          )}

          {otherConfigs?.length > 0 &&
            otherConfigs?.map((cfg) => (
              <div key={cfg.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={cfg.id}
                  name="paymentMethod"
                  value={cfg.id}
                  checked={selectedMethod === cfg.id}
                  onChange={handleChange}
                  className="size-4 accent-blue8"
                />
                <label
                  htmlFor={cfg.id}
                  className="flex w-full cursor-pointer items-center gap-3"
                >
                  <Paragraph
                    level={isMobile ? 3 : 2}
                    className="capitalize text-neutral9 md:text-neutral10"
                  >
                    {cfg.bankName}
                  </Paragraph>
                  <img
                    src={cfg.methodLogo || "/default-image.png"}
                    alt={`${cfg.bankName} Logo`}
                    className="h-4 w-auto object-contain"
                    onError={(e) => {
                      if (e.target.src !== "") {
                        e.target.style.display = "none";
                      }
                    }}
                  />
                </label>
              </div>
            ))}
        </div>

        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          className="mt-4 text-center md:hidden"
          size="small"
        >
          Bayar
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentMethod;
