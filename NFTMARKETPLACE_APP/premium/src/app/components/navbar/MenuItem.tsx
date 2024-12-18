'use client';

interface MenuItemProps {
    onClick: () => void
    label: string
}
export default function MenuItem({ 
    onClick, 
    label }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="px-2 py-3 text-xs hover:bg-neutral-100 transition font-semibold"
    >
      {label}
    </div>
  );
}
