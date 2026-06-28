import { IoIosAdd } from "react-icons/io";
import styles from "./deedaddfab.module.css";
import Tooltip from "@/components/secondary/tooltip/Tooltip";

type Props = {
  ariaLabel: string;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
};

export default function DeedCircleAddButton({ ariaLabel, onClick, tooltip, disabled = false }: Props) {
  const button = (
    <button
      type="button"
      className={styles.fab}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <IoIosAdd aria-hidden="true" />
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip text={tooltip} position="left">
      {button}
    </Tooltip>
  );
}
