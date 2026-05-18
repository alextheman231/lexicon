import type { ReactNode } from "react";

import { useScreenSize } from "@alextheman/components";

import NavigationBottom from "src/components/PageWrapper/NavigationBottom";
import NavigationDrawer from "src/components/PageWrapper/NavigationDrawer";

interface PageWrapperProps {
  children: ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
  const { isLargeScreen } = useScreenSize();

  return isLargeScreen ? (
    <NavigationDrawer>{children}</NavigationDrawer>
  ) : (
    <NavigationBottom>{children}</NavigationBottom>
  );
}

export default PageWrapper;
