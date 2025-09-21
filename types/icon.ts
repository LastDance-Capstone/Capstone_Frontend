export type IconName =
  | "check"
  | "cloud-upload"
  | "download"
  | "log-in"
  | "log-out"
  | "play";

export default interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}