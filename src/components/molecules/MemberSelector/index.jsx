'use client';
import { useEffect, useMemo, useState } from 'react';
import { User, X } from 'lucide-react';

import SearchBar from '@/components/molecules/SearchBar';
import Pagination from '@/components/organisms/Pagination';

const MemberSelector = ({
  selectedMembers = [],
  availableMembers = [],
  onMembersChange,
  label = 'Anggota',
  loading = false,
  showSearch = true,
  searchPlaceholder = 'Cari kontak',
  type = 'member',
  serverSide = false,
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}) => {
  const [checkedMembers, setCheckedMembers] = useState({});
  const [internalMembers, setInternalMembers] = useState([]);
  const [search, setSearch] = useState('');

  const normalizeGender = (jns_kelamin) => {
    if (jns_kelamin === '1' || jns_kelamin === 1) return 'Laki - Laki';
    if (jns_kelamin === '2' || jns_kelamin === 2) return 'Perempuan';
    return '-';
  };

  const mapKontakToMember = (item) => ({
    id: item?.id,
    name: item?.nama ?? item?.name ?? '-',
    phone: item?.no_wa ?? item?.phone ?? '-',
    gender: normalizeGender(item?.jns_kelamin ?? item?.gender),
  });

  useEffect(() => {
    const normalized = (availableMembers || []).map(mapKontakToMember);
    setInternalMembers(normalized);
  }, [availableMembers]);

  const filteredMembers = useMemo(() => {
    if (serverSide) return internalMembers || [];
    if (!search) return internalMembers || [];
    const q = search.toLowerCase();
    return (internalMembers || []).filter(
      (m) =>
        (m?.name || '')?.toLowerCase().includes(q) ||
        (m?.phone || '')?.toLowerCase().includes(q)
    );
  }, [internalMembers, search, serverSide]);

  const handleRemoveSelectedMember = (memberId) => {
    const updatedMembers = selectedMembers.filter(
      (member) => member.id !== memberId
    );

    setCheckedMembers((prev) => ({
      ...prev,
      [memberId]: false,
    }));

    onMembersChange?.(updatedMembers);
  };

  const handleCheckboxChange = (memberId) => {
    const isCurrentlySelected = selectedMembers.some(
      (selected) => selected.id === memberId
    );
    const isCurrentlyChecked = checkedMembers[memberId];

    setCheckedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));

    if (isCurrentlySelected) {
      const updatedMembers = selectedMembers.filter(
        (selected) => selected.id !== memberId
      );
      onMembersChange?.(updatedMembers);
    } else if (!isCurrentlyChecked) {
      const sourceMembers =
        internalMembers && internalMembers.length > 0
          ? internalMembers
          : availableMembers;
      const memberToAdd = sourceMembers.find(
        (member) => member.id === memberId
      );
      if (memberToAdd) {
        const updatedMembers = [...selectedMembers, memberToAdd];
        onMembersChange?.(updatedMembers);
      }
    }
  };

  const isMemberSelected = (memberId) => {
    return selectedMembers.some((member) => member.id === memberId);
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-[12px] font-bold text-gray-500">
        {label}
      </label>

      {/* Selected Members Chips */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-[4px] border p-3">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="inline-flex items-center gap-2 rounded-[4px] border bg-[#FAF2DC] px-3 py-1.5 text-sm text-gray-700 shadow-sm"
            >
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span className="font-medium">{member.name ?? member.nama}</span>
              {type === 'member' && (
                <>
                  <span className="text-gray-500">-</span>
                  <span className="text-gray-600">
                    {member.phone ?? member.no_wa}
                  </span>
                </>
              )}
              <button
                onClick={() => handleRemoveSelectedMember(member.id)}
                className="ml-1 rounded-full p-0.5 text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                title="Hapus anggota"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available Members Table */}
      <div className="overflow-hidden rounded-[4px] border border-gray-200">
        {showSearch && (
          <div className="border-b border-gray-200 p-2">
            <SearchBar
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (serverSide) {
                  onSearchChange?.(value);
                }
              }}
              className="w-full"
            />
          </div>
        )}
        <div className="max-h-[180px] overflow-y-auto">
          <table className="w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200 bg-white">
              {(filteredMembers || []).map((member) => {
                const isSelected = isMemberSelected(member.id);
                const isChecked = checkedMembers[member.id] || isSelected;

                return (
                  <tr
                    key={member.id}
                    className={`transition-colors duration-150 hover:bg-gray-50 ${
                      isSelected ? 'bg-gray-50 opacity-60' : ''
                    }`}
                  >
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(member.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {member.name}
                      {isSelected && (
                        <span className="ml-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Terpilih
                        </span>
                      )}
                    </td>
                    {type === 'member' && (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {member.phone}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {member.gender}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Memuat data kontak...
                  </td>
                </tr>
              )}

              {!loading && (internalMembers || []).length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada anggota tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {serverSide && totalItems > 0 && (
          <div className="border-t border-gray-200 p-2">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              showRowsPerPage={true}
              labels={{
                rowsPerPage: 'Baris per halaman',
                showing: 'Menampilkan',
                of: 'dari',
              }}
              className="text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSelector;
