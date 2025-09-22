"use client";

import { useId } from "react";
import TextAreaProps from "@/types/textarea";
import styles from "./textarea.module.css";

export default function TextArea({
  helperText,
  error = false,
  className,
  ...rest
}: TextAreaProps) {
  const autoId = useId();
  const id = rest.id || autoId;

  const containerClassName = [
    styles.textfield,
    error ? styles.error : "",
    className,
  ]
    .join(" ")
    .trim();

  return (
    <div className={containerClassName}>
      <textarea {...rest} id={id} className={styles.input} />
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}
