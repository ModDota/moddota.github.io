declare module '!!file-loader*' {
  const url: string;
  export default url;
}

declare module '*.svg' {
  interface Props {
    className?: string;
    width?: number | string;
    height?: number | string;
  }

  export default function value(props: JSX.IntrinsicElements['svg'] & Props): JSX.Element;
}
