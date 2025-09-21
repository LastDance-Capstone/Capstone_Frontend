"use client";

import { useId } from "react";
import TextFieldProps from "@/types/textfield";
import styles from "./textfield.module.css";

export default function TextField({
  helperText,
  error = false,
  className,
  ...rest
}: TextFieldProps) {
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
