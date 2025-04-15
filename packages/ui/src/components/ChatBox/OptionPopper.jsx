import { Menu, MenuItem } from '@mui/material';
import { useCallback } from 'react';

const StyledMenu = styled(Menu)({
  '& .MuiMenu-paper': {
    "&::-webkit-scrollbar": {
      width: '0 !important',
      height: '0',
    },
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
  }
});

export default function OptionPopper({
  anchorEl,
  setAnchorEl,
  options,
  handleSelect,
}) {
  const handleClickAway = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleSelectClose = useCallback(option => () => {
    handleSelect(option)()
    handleClickAway();
  }, [handleClickAway, handleSelect])

  const open = Boolean(anchorEl);

  return (
    <StyledMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClickAway}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {
        (options || []).map((option, i) => {
          return (
            <MenuItem key={i} onClick={handleSelectClose(option)}>{option.name}</MenuItem>
          )
        })
      }
    </StyledMenu>
  );
}