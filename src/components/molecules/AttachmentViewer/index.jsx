import { useEffect,useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

import BaseModal from '@/components/molecules/Modal';
import { getCurrentUserRoles, isDisbunak } from '@/libs/permissions';

const FileIcon = ({ type }) => {
  const configs = {
    image: {
      bg: 'bg-bgColor',
      color: 'text-primary',
      path: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    pdf: {
      bg: 'bg-error1',
      color: 'text-tertiary',
      path: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
    file: {
      bg: 'bg-neutral-100',
      color: 'text-neutral-500',
      path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
  };
  const { bg, color, path } = configs[type] || configs.file;
  return (
    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${bg} ${color}`}>
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
      </svg>
    </span>
  );
};

const AttachmentViewer = ({
  label = 'Lampiran',
  fileUrl,
  thumbUrl,
  fileSize,
  className = '',
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDisbunakUser, setIsDisbunakUser] = useState(false);

  useEffect(() => {
    setMounted(true);
    const roles = getCurrentUserRoles();
    setIsDisbunakUser(isDisbunak(roles));
  }, []);

  if (!fileUrl) return null;

  const getFileExtension = (url) => {
    try {
      return url.split('?')[0].split('.').pop().toLowerCase();
    } catch {
      return '';
    }
  };

  const ext = getFileExtension(fileUrl);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
  const isPDF = ext === 'pdf';
  const fileType = isImage ? 'image' : isPDF ? 'pdf' : 'file';
  const displaySrc = !imageError ? (thumbUrl || (isImage ? fileUrl : null)) : null;

  const handleDownload = () => {
    setIsDownloading(true);

    try {
      const fileName = fileUrl.split('/').pop()?.split('?')[0] || 'download';
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`group flex flex-col ${className}`}>
      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-100 px-3.5 py-2.5">
          <FileIcon type={fileType} />
          <span className="flex-1 truncate text-sm font-medium text-neutral-800">{label}</span>
        </div>

        {/* Thumbnail Container */}
        <div
          onClick={() => setIsPreviewOpen(true)}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-neutral-50 transition-colors hover:bg-neutral-100"
        >
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-50 text-neutral-300 transition-colors group-hover:bg-neutral-100 group-hover:text-neutral-400">
              <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-neutral-100 transition-transform group-hover:scale-110">
                <FileIcon type={fileType} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {fileType} Document
                </span>
                <span className="text-[9px] text-neutral-400 italic">
                  Klik untuk preview
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
            <span className="translate-y-1 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-neutral-800 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Klik untuk preview
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3.5 py-2">
          <span className="text-xs text-neutral-400">
            {ext.toUpperCase()}{fileSize ? ` · ${fileSize}` : ''}
          </span>

          {mounted && !isDisbunakUser && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-bgColor px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-bgColor disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <svg className="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {isDownloading ? 'Mengunduh...' : 'Unduh'}
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <BaseModal
        open={isPreviewOpen}
        setOpen={setIsPreviewOpen}
        label={label}
        className="!max-w-5xl"
        isShowCloseIcon={true}
        showBottomButton={false}
      >
        <div className="mt-4 flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {/* Modal topbar */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileIcon type={fileType} />
              <span className="text-sm font-medium text-neutral-800">{label}</span>
            </div>

            {mounted && !isDisbunakUser && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-neutral-700 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {isDownloading ? 'Mengunduh...' : 'Unduh'}
              </button>
            )}
          </div>

          {/* Preview area */}
          <div className="flex min-h-[400px] items-center justify-center bg-neutral-900 p-6">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-lg">
              {isImage ? (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={fileUrl}
                    alt={label}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              ) : isPDF ? (
                <iframe
                  src={`${fileUrl}#navpanes=0&toolbar=1`}
                  className="h-[560px] w-full border-none bg-white"
                  title={label}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-16 text-center backdrop-blur-sm">
                  <div className="rounded-full bg-white/20 p-6">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-white/80">Preview tidak tersedia untuk format ini.</p>

                  {mounted && !isDisbunakUser && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90 active:scale-95"
                    >
                      Buka File
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};



export default AttachmentViewer;