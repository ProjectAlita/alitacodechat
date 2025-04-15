import { useTheme } from '@emotion/react';
import SvgIcon from "@mui/material/SvgIcon";

export default function DarkLightIcon(props) {
  const theme = useTheme();
  return (
    <SvgIcon {...props}>
      <svg
        width="17"
        height="16"
        viewBox="-2 -1 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 8.279 0 C 3.7062 0 0 3.7062 0 8.279 s 3.7062 8.279 8.279 8.279 s 8.279 -3.7062 8.279 -8.279 S 12.8519 0 8.279 0 z M 8.279 15.1772 V 1.3809 c 3.8097 0 6.8981 3.0885 6.8981 6.8981 C 15.1772 12.0887 12.0887 15.1772 8.279 15.1772 z"
          fill={props.fill || theme.palette.icon.fill.default}
        />
      </svg>
    </SvgIcon>
  );
}
