"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
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
  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      
      // body 스크롤 방지
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // 모달 닫힐 때 원래 상태로 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // 이전 스크롤 위치로 복원
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
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

  // Portal을 사용하여 document.body에 직접 렌더링
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}