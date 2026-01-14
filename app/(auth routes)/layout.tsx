import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PrivateRoutesLayout({ children }: Props) {
  return <>{children}</>;
}
