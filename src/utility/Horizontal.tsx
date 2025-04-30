interface Props {
  children: React.ReactNode;
  gap?: number;
  p?: number;
  px?: number;
  py?: number;
  mt?: number;
  ml?: number;
  center?: boolean;
  right?: boolean;
  borderTop?: string;
  borderBottom?: string;
  background?: string;
  between?: boolean;
  nowrap?: boolean;
  top?: boolean;
}

export function Horizontal({
  children,
  gap,
  p,
  px,
  py,
  mt,
  ml,
  center,
  right,
  borderTop,
  borderBottom,
  background,
  between,
  nowrap,
  top,
}: Props) {
  const style = {
    display: 'flex',
    flexDirection: 'row' as 'row',
    gap,
    paddingTop: py || p,
    paddingBottom: py || p,
    paddingLeft: px || p,
    paddingRight: px || p,
    marginTop: mt,
    marginLeft: ml,
    alignItems: top ? 'flex-start' : 'center',
    justifyContent: center ? 'center' : right ? 'flex-end' : between ? 'space-between' : 'flex-start',
    flexWrap: (nowrap ? 'nowrap' : 'wrap') as 'nowrap' | 'wrap',
    borderTop,
    borderBottom,
    background,
  };

  return <div style={style}>{children}</div>;
}
