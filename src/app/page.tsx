'use client'

import { Breakpoint } from "@/constants/enums";
import { getBreakpoint } from "@/store/slices/utils";
import { setSidebarExpanded } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSidebarExpanded, selectViewportWidth } from "@/store/slices/selectors";

export default function Home() {
  const dispatch = useAppDispatch();
  const sidebarExpanded = useAppSelector(selectSidebarExpanded);
  const breakpoint = getBreakpoint(useAppSelector(selectViewportWidth));

  return (
    breakpoint === Breakpoint.Mobile ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <button onClick={() => dispatch(setSidebarExpanded(!sidebarExpanded))}>
          {!sidebarExpanded ? "Open" : "Close"}
        </button>
      </div>
    ) : <div />
  );
}