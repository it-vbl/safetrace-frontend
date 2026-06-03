const StatCard = ({
    title,
    value,
    isActive,
    onClick,
}) => (
    <div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        ${isActive
                ? 'border-green8 bg-[#F0FDF4] shadow-[0_4px_12px_rgba(0,0,0,0.05)] -translate-y-[2px]'
                : 'border-gray-200 bg-white hover:border-green8/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-[1px]'
            }
      `}
    >
        {/* Subtle Top Border Indicator when active */}
        <div
            className={`absolute left-0 top-0 h-1 w-full transition-all duration-300 ${isActive ? 'bg-green8 opacity-100' : 'bg-transparent opacity-0'
                }`}
        />

        <div className="relative z-10 flex flex-col gap-1">
            <div
                className={`text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${isActive ? 'text-green8' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
            >
                {title}
            </div>
            <div
                className={`text-xl font-bold transition-colors duration-300 sm:text-2xl ${isActive ? 'text-gray-900' : 'text-gray-800'
                    }`}
            >
                {value}
            </div>
        </div>

        {/* Indicator Dot */}
        <div
            className={`absolute -right-2 -top-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-500 ${isActive ? 'scale-100 bg-green8/10 opacity-100' : 'scale-50 opacity-0'
                }`}
        >
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green8" />
        </div>
    </div>
);

export default StatCard;