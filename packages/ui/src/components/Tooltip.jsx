import { Tooltip, tooltipClasses } from "@mui/material";
import { filterProps } from "@/common/utils";
import { useCallback, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
), filterProps('extraStyles'))(({ extraStyles }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...extraStyles,
  },
}));

export const TooltipWithDuration = forwardRef(function TooltipWithDurationFunc(props, ref) {
  const { delaySeconds = 3000, children } = props
  const [open, setOpen] = useState(false);
  const openTipTimerIdRef = useRef()
  
  const handleMouseEnter = useCallback(() => {
    // show the tooltip after 3 seconds
    openTipTimerIdRef.current = setTimeout(() => {
      openTipTimerIdRef.current = undefined
      setOpen(true);
    }, delaySeconds);
  }, [delaySeconds])
  
  const handleMouseLeave = useCallback(() => {
    setOpen(false);
    if (openTipTimerIdRef.current) {
      clearTimeout(openTipTimerIdRef.current)
    }
  }, [])
  
  const onClose = useCallback(
    () => {
      setOpen(false);
      if (openTipTimerIdRef.current) {
        clearTimeout(openTipTimerIdRef.current)
        openTipTimerIdRef.current = undefined
      }
    },
    [],
  )
  
  const onCloseRef = useRef(onClose)
  
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])
  
  useImperativeHandle(ref, () => {
    return {
      closeTooltip: () => onCloseRef.current(),
    };
  }, []);
  
  return (
    <StyledTooltip
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      open={open}
      onOpen={undefined}
      onClose={onClose}
    >
      {children}
    </StyledTooltip>
  );
})

export default StyledTooltip;