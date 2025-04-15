import React from 'react';
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuList, Paper, Popper, Typography } from '@mui/material';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import { useTheme } from '@emotion/react';
import { StyledMenuItem, StyledMenuItemIcon } from './SingleSelect';
import SvgIcon from "@mui/material/SvgIcon";

const StyledButtonGroup = styled(ButtonGroup)(() => (`
    border-radius: 14px;
    height: '28px',
`))

export const StyledMenuList = styled(MenuList)(({theme}) => ({
  '& .MuiMenuItem-root': {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '24px',
    padding: '8px 20px 8px 20px',

    '&:hover': {
      backgroundColor: theme.palette.background.select.hover,
    },

    '&.Mui-selected': {
      backgroundColor: theme.palette.background.select.selected.default,
    },

    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.background.select.selected.hover,
    },
  }
}))

export default function SplitButton({ defaultValue = '', options = [], onClick }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedOption, setSelectedOption] = React.useState(options.find(option => option.value === defaultValue))

  const handleToggle = React.useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = React.useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, []);

  const onClickOption = React.useCallback((option) => (event) => {
    handleClose(event);
    setSelectedOption(option)
    onClick(option.value);
  }, [handleClose, onClick])

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <Box>
          <StyledButtonGroup sx={{
            '.MuiButtonGroup-grouped': {
              borderRightColor: `${theme.palette.border.category.selected} !important`,
            },
            '.MuiButtonGroup-grouped.MuiButtonGroup-firstButton': {
              borderRightColor: `${theme.palette.border.category.selected} !important`,
            },
          }} variant="contained" ref={anchorRef} aria-label="split button">
            <Button
              variant='alita'
              disableRipple sx={{ marginRight: '0px' }}
              color='secondary'
              onClick={onClickOption(selectedOption)}
            >
              {selectedOption.label}
            </Button>
            <Button
              variant='alita'
              disableRipple
              sx={{ marginRight: '0px' }}
              color='secondary'
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDownIcon />
            </Button>
          </StyledButtonGroup>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper sx={{
                  color: 'secondary',
                  background: theme.palette.background.secondary
                }}>
                  <StyledMenuList id="split-button-menu">
                    {
                      options.map(({ label, value }) => (
                        <StyledMenuItem
                          selected={selectedOption.value === value}
                          key={value}
                          // sx={{
                          //   background: selectedOption.value === value ? theme.palette.background.participant.active : undefined
                          // }}
                          onClick={onClickOption({ label, value })}>
                          <Typography color='text.secondary' variant='bodyMedium'>
                            {label}
                          </Typography>
                          {selectedOption.value === value && (
                            <StyledMenuItemIcon>
                              <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none">
                                  <path d="M13.8359 0.948849L4.87629 9.83708C4.82429 9.88873 4.76253 9.9297 4.69455 9.95766C4.62657 9.98561 4.5537 10 4.48011 10C4.40652 10 4.33365 9.98561 4.26567 9.95766C4.19769 9.9297 4.13594 9.88873 4.08393 9.83708L0.164104 5.94848C0.05903 5.84424 0 5.70286 0 5.55545C0 5.40804 0.05903 5.26666 0.164104 5.16242C0.269178 5.05819 0.411689 4.99963 0.560286 4.99963C0.708884 4.99963 0.851395 5.05819 0.956469 5.16242L4.48011 8.65869L13.0435 0.162796C13.1486 0.0585594 13.2911 -1.09831e-09 13.4397 0C13.5883 1.09832e-09 13.7308 0.0585594 13.8359 0.162796C13.941 0.267034 14 0.40841 14 0.555823C14 0.703236 13.941 0.844612 13.8359 0.948849Z"/>
                                </svg>
                              </SvgIcon>
                            </StyledMenuItemIcon>
                          )}
                        </StyledMenuItem>)
                      )
                    }
                  </StyledMenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
      </ClickAwayListener>
    </>
  );
}