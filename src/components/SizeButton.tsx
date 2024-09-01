"use client"

interface SizeButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    selected?: boolean;
    className?: string;
}

const SizeButton: React.FC<SizeButtonProps> = ({ children, onClick, selected, className }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 border rounded-md cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
};

export default SizeButton;
