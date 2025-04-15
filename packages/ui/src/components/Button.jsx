import { buttonClasses } from '@mui/material/Button';
export const alitaButtonStyle = (theme, color) => ({
  ...theme.typography.labelSmall,
  padding: '6px 16px',
  borderRadius: '28px',
  textTransform: 'none',
  ['&.' + buttonClasses.colorPrimary]: {
    color: theme.palette.text.button.primary,
    background: theme.palette.background.button.primary.default,
    '&:hover': {
      background: theme.palette.background.button.primary.hover,
    },
    '&:active': {
      background: theme.palette.background.button.primary.pressed,
    },
    '&:disabled': {
      color: theme.palette.text.button.primary,
      background: theme.palette.background.button.primary.disabled,
    },
  },
  ['&.' + buttonClasses.colorSecondary]: {
    color: theme.palette.text.secondary,
    background: theme.palette.background.button.secondary.default,
    '&:hover': {
      background: theme.palette.background.button.secondary.hover,
    },
    '&:active': {
      color: theme.palette.text.primary,
      background: theme.palette.background.button.secondary.pressed,
      border: `1px solid ${theme.palette.border.lines}`,
    },
    '&:disabled': {
      color: theme.palette.text.button.disabled,
      background: theme.palette.background.button.default,
    },
  },
  ... (color === 'tertiary' ? {
    color: theme.palette.text.default,
    background: 'transparent',
    minWidth: '28px !important',
    height: '28px',
    borderRadius: '16px',
    padding: '6px',
    gap: '10px',
    '&:hover': {
      background: theme.palette.background.button.secondary.default,
    },
    '&:active': {
      color: theme.palette.text.primary,
      background: theme.palette.background.button.secondary.pressed,
      border: `1px solid ${theme.palette.border.lines}`,
    },
    '&:disabled': {
      color: theme.palette.text.button.disabled,
      background: 'transparent',
    },
  } : {}),
  ... (color === 'alarm' ? {
    color: 'white',
    background: theme.palette.background.button.alarm.default,
    height: '28px',
    borderRadius: '16px',
    gap: '10px',
    '&:hover': {
      background: theme.palette.background.button.alarm.hover,
    },
    '&:active': {
      color: theme.palette.text.primary,
      background: theme.palette.background.button.alarm.pressed,
      border: `1px solid ${theme.palette.border.lines}`,
    },
    '&:disabled': {
      color: theme.palette.text.button.primary,
      background: theme.palette.background.button.alarm.disabled,
    },
  } : {})
})

