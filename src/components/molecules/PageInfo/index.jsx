import { useSelector } from 'react-redux';
import { PaginationText } from '../../atoms/PaginationText';

export function PageInfo({
  currentPage,
  pageSize,
  totalItems,
  showingText = 'Menampilkan',
  ofText = 'dari',
  loading = false,
}) {
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  if (loading) {
    return <PaginationText variant='loading'>Loading...</PaginationText>;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <PaginationText>
      { isMobileScreen ? '' : showingText} {startItem} - {endItem} {ofText} {totalItems}
    </PaginationText>
  );
}
