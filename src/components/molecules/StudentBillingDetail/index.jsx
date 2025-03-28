import { useMemo,useState } from "react";
import { useDispatch } from "react-redux";

import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import ChevronDown from "@/components/atoms/Icons/ChevronDown";
import Heading from "@/components/atoms/Typography/Heading";
import Paragraph from "@/components/atoms/Typography/Paragraph";
import InputText from "@/components/molecules/InputText";
import StatusLabel from "@/components/molecules/StatusLabel";
import DataTable from "@/components/organisms/DataTable";
import convertMoney from "@/helpers/utils/convertMoney";
import useScreenSize from "@/helpers/utils/useScreenSize";
import { setSelectedSort } from "@/store/data/actions";

const StudentBillingDetail = ({
  data = {
    fullName: "Axel Pramudian",
    nis: "1637483939",
    schoolClass: "X IPA 1",
    latestschoolyear: "2023/2024",
  },
  billings,
  isLoading,
  onExpand,
  onSubmit,
  isExpanded,
  setIsExpanded,
  handlePayDonation = () => {},
  donations,
}) => {
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);
  const { isMobile } = useScreenSize();

  const handleExpand = async () => {
    if (!isExpanded) await onExpand?.();
    setIsExpanded();
    setSelectedRows([]);
    dispatch(
      setSelectedSort({
        data: {
          field: "",
          direction: "",
        },
      }),
    );
  };

  const handleRowSelection = (params) => {
    const isSelected = selectedRows.some(
      (row) => row?.billingStudentId === params.data?.billingStudentId,
    );
    setSelectedRows(
      isSelected
        ? selectedRows.filter(
            (row) => row?.billingStudentId !== params.data?.billingStudentId,
          )
        : [...selectedRows, params.data],
    );
  };

  const columnDefs = [
    {
      field: "checkbox",
      headerComponent: () => (
        <div className="flex justify-center">
          <Checkbox
            onChange={() => {
              setSelectedRows(
                selectedRows.length === rowData.length ? [] : [...rowData],
              );
            }}
            value={
              billings == null ? null : selectedRows.length === rowData.length
            }
          />
        </div>
      ),
      cellRenderer: (params) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex h-full items-center"
        >
          <Checkbox
            value={selectedRows.some(
              (row) => row?.billingStudentId === params.data?.billingStudentId,
            )}
            onChange={() => handleRowSelection(params)}
          />
        </div>
      ),
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      flex: 0,
      suppressSizeToFit: true,
      resizable: false,
      sortable: false,
    },
    {
      headerName: "Nama Tagihan",
      field: "detailBillingName",
      minWidth: 170,
      sortable: true,
    },
    {
      headerName: "Tipe Tagihan",
      field: "billingType",
      minWidth: 170,
      sortable: true,
      valueFormatter: (params) => params.value || "-",
    },
    {
      headerName: "Jumlah Tagihan",
      field: "amount",
      minWidth: 170,
      valueFormatter: (params) => convertMoney(params.value),
      sortable: true,
    },
    {
      headerName: "Status",
      field: "paymentStatus",
      minWidth: 150,
      headerClassName: "!items-center !justify-center",
      cellRenderer: (params) => (
        <div className="flex size-full items-center justify-center">
          <StatusLabel
            status={params.value}
            text={params.value}
            className="w-max"
          />
        </div>
      ),
    },
  ];

  const rowData = billings || [];

  const totalAmount = useMemo(() => {
    return selectedRows.reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-neutral4">
      <div className="flex w-full justify-between p-4">
        <div className="flex flex-col gap-1 md:gap-2">
          <Heading level={2} className="font-bold text-blue8">
            {data.fullName}
          </Heading>

          {isMobile ? (
            <Paragraph level={3} className="!font-normal text-neutral8">
              {data.nis} - {data.schoolClass}
            </Paragraph>
          ) : (
            <Paragraph level={3} className="font-medium">
              {data.nis} - <b>{data.schoolClass}</b>
            </Paragraph>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Paragraph
            level={3}
            className="text-right font-medium text-neutral8 md:text-black"
          >
            Tahun Ajaran
          </Paragraph>
          <Heading
            level={5}
            className="rounded-full bg-neutral5 px-2 py-1 text-right font-bold"
          >
            {data.schoolYearName}
          </Heading>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4">
          <div className="mb-4 max-h-[410px] overflow-hidden">
            <DataTable
              columnDefs={columnDefs}
              rowData={rowData}
              showPagination={false}
              isShowIndexing={false}
              onCellClicked={(params) => {
                // Ignore clicks on checkbox column
                if (params.column.getColId() !== "checkbox") {
                  handleRowSelection(params);
                }
              }}
              rowStyle={{ cursor: "pointer" }}
              domLayout="normal"
              customHeightTable="400px"
              containerClassName="student-billing-table"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="items-center justify-between gap-1 rounded-lg bg-neutral3 p-4 md:flex md:rounded-none">
              <Paragraph level={2} className="mb-1 font-bold md:mb-0">
                Total Pembayaran
              </Paragraph>
              <InputText
                value={convertMoney(totalAmount).replaceAll("Rp", "Rp ")}
                disabled
                containerClassName="w-full max-w-[342px]"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                disabled={selectedRows.length === 0}
                className="w-full md:w-[165px]"
                onClick={() => {
                  onSubmit?.({ ...data, billings: selectedRows });
                }}
              >
                Bayar Tagihan
              </Button>
            </div>

            <div className="border border-neutral4" />

            {donations?.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {donations.map((item, index) => (
                  <div
                    className="h-[76px] rounded-md bg-neutral3"
                    key={item.billingId}
                  >
                    <div className="flex w-full items-center justify-between gap-x-4 p-4">
                      <Paragraph
                        level={3}
                        className="break-all !font-semibold md:!font-bold"
                        key={index}
                      >
                        {item.billingName}
                      </Paragraph>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handlePayDonation(
                            item.billingName,
                            data,
                            item.billingId,
                          )
                        }
                      >
                        Bayar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="px-4">
          <div className="h-[2px] w-full bg-neutral4" />
        </div>
      )}

      <div className="flex w-full items-end justify-end p-4 md:border-t md:border-neutral4">
        <Button
          variant="tertiary"
          size="small"
          icon={
            <div
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            >
              <ChevronDown size={12} />
            </div>
          }
          className="flex-row-reverse px-2"
          onClick={handleExpand}
          isLoading={isLoading}
        >
          {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
        </Button>
      </div>
    </div>
  );
};

export default StudentBillingDetail;
