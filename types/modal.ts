export default interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}