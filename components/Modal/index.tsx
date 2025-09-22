"use client";

import ModalProps from "@/types/modal";
import styles from "./modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  className,
  actions,
  children
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {title}
          </h2>
          <div className={`${styles.body} ${className}`}>
            {children}
          </div>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}