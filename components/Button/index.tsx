import Icon from "@/components/Icon";
import ButtonProps from "@/types/button";
import styles from "./button.module.css";

export default function Button({
  children,
  size = "medium",
  variant = "filled",
  disabled = false,
  iconName,
  iconOnly = false,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[size],
    styles[variant],
    iconOnly ? styles.iconOnly : "",
    className,
  ]
    .join(" ")
    .trim();

  return (
    <button className={buttonClassName} disabled={disabled} onClick={onClick} {...rest}>
      {iconName && (
        <Icon
          name={iconName}
          size={20}
          color={
            variant === "filled" || variant === "warn"
              ? "var(--theme-text-inverse)"
              : undefined
          }
        />
      )}
      {!iconOnly && children}
    </button>
  );
}
