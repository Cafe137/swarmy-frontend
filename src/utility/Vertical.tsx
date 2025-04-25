import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  gap?: number;
  p?: number;
  border?: string;
  borderRadius?: number;
  width?: number;
  center?: boolean;
  middle?: boolean;
  background?: string;
}

export function Vertical({ children, gap, p, border, borderRadius, width, center, middle, background }: Props) {
  const style = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap,
    padding: p,
    border,
    borderRadius,
    maxWidth: '100%',
    width,
    alignItems: center ? 'center' : undefined,
    justifyContent: middle ? 'center' : undefined,
    background,
  };

  return <div style={style}>{children}</div>;
}
