export default interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
  error?: boolean;
  className?: string;
}