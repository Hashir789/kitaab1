import Link from "next/link";
import { IoIosAdd } from "react-icons/io";
import styles from "./deedaddfab.module.css";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { deedsAria } from "@/constants/placeholders";

type Props = {
  userId: string;
};

export default function DeedAddFab({ userId }: Props) {
  return (
    <Tooltip text={deedsAria.ADD} position="left" className={styles.fabTooltip}>
      <Link
        href={`/user/${userId}/deeds/new`}
        className={styles.fab}
        aria-label={deedsAria.ADD}
      >
        <IoIosAdd aria-hidden="true" />
      </Link>
    </Tooltip>
  );
}
