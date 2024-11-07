import { MouseEventHandler } from "react";
import { IoSendSharp, IoStop } from "react-icons/io5";

/**
 * Props for the `UserRequestForm` component.
 */
export interface UserRequestFormProps {
  /**
   * Function to handle form submission.
   * @param prompt - The query string to be submitted.
   */
  onSubmit: (prompt: string) => void;

  /**
   * Initial value for the input prompt.
   */
  inputPrompt?: string;

  /**
   * Flag to disable the form and associated elements.
   */
  disabled: boolean;

  /**
   * Function to handle closing of the event source when the form is disabled.
   */
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * `UserRequestForm` component for user input and form submission.
 * @param props - Component props.
 * @returns JSX.Element
 */
export const UserRequestForm: React.FC<UserRequestFormProps>;

/**
 * Icons used in the `UserRequestForm` component.
 */
export { IoSendSharp, IoStop };
