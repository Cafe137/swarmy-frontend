interface Props {
  children: string;
}

export function StyledH2({ children }: Props) {
  return (
    <h2
      style={{
        borderBottom: '3px solid rgb(249, 115, 22)',
      }}
    >
      <span
        style={{
          color: 'rgb(249, 115, 22)',
        }}
      >
        →&nbsp;
      </span>
      {children}
    </h2>
  );
}
