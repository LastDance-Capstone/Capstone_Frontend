export default interface TextFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
  error?: boolean;
  className?: string;
}