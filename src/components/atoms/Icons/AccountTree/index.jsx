const AccountTree = ({ size = 16, color = "#454545" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6654 7.33333V2H9.9987V4H5.9987V2H1.33203V7.33333H5.9987V5.33333H7.33203V12H9.9987V14H14.6654V8.66667H9.9987V10.6667H8.66536V5.33333H9.9987V7.33333H14.6654ZM4.66536 6H2.66536V3.33333H4.66536V6ZM11.332 10H13.332V12.6667H11.332V10ZM11.332 3.33333H13.332V6H11.332V3.33333Z"
        fill={color}
      />
    </svg>
  );
};

export default AccountTree;
