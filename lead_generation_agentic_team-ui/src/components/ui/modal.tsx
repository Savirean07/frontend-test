import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Modal = ({ children, className }: ModalProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center backdrop-blur-sm z-50 px-4">
      <div
        className={`bg-black rounded-2xl border border-green-500/30 animate-slide-up ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
