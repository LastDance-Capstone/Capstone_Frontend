import styles from "./icon.module.css";
import svgPath from "./icons.json";

import IconProps from "@/types/icon";

export default function Icon({
  name,
  size = 24,
  color = "var(--theme-text-primary)",
  className
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${styles.icon} ${className ?? ""}`.trim()} // 스타일 및 추가 클래스 적용
    >
      {/* SVG path 데이터 적용, stroke는 color 사용 */}
      <path d={svgPath[name].path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}