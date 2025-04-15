import { alitaButtonStyle } from "@/components/Button.jsx";
import lightPalette from './lightPalette.js';
import darkPalette, { darkBlue, white } from './darkPalette.js';

export const typographyVariants = {
  headingMedium: {
    color: (theme) => theme.palette.text.secondary,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
  },
  headingSmall: {
    color: (theme) => theme.palette.text.secondary,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '24px',
  },
  labelMedium: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
  },
  labelSmall: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
  },
  bodyMedium: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '24px',
  },
  bodySmall: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
  },
  bodySmall2: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '20px',
  },
  subtitle: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.72px',
    textTransform: 'uppercase',
  },
}

const components = {
  MuiFormControl: {
    styleOverrides: {
      root: {
        '&.Mui-error': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        scrollbarWidth: 'none',
      },
      body: {
        caretColor: 'transparent',
        height: '100%',
        '::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
      },
      input: {
        caretColor: 'auto',
      },
      textArea: {
        caretColor: 'auto',
      }
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: theme.palette.background.avatar,
        color: theme.palette.text.default,
      })
    }
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: theme.palette.background.avatar,
      }),
      outlined: ({ theme }) => ({
        background: theme.palette.background.alitaDefault,
        color: theme.palette.text.secondary,
      })
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: theme.palette.background.alitaDefault,
      })
    }
  },
  MuiSelect: {
    styleOverrides: {
      select: ({ theme }) => ({
        color: theme.palette.text.secondary,
      })
    }
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        background: theme.palette.background.secondary,
        borderRadius: '0.5rem',
        border: `1px solid ${theme.palette.border.lines}`,
      }),
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: '0.75rem',
        color: theme.palette.text.default,
        '& .MuiTablePagination-select.MuiSelect-standard': {
          color: theme.palette.text.default,
        }
      }),
      selectLabel: ({ theme }) => ({
        ...typographyVariants.labelSmall,
        color: theme.palette.text.button.disabled,
      }),
      displayedRows: ({ theme }) => ({
        ...typographyVariants.labelSmall,
        color: theme.palette.text.default,
      }),
      menuItem: {
        fontSize: '0.75rem',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.MuiTab-textColorPrimary": {
          color: theme.palette.text.default,
        },
        "&.Mui-selected": {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiAlert: {
    styleOverrides: {
      filledSuccess: {
        backgroundColor: 'green',
        background: 'green',
        color: white
      },
      filledError: {
        backgroundColor: 'red',
        background: 'red',
        color: white
      },
      filledInfo: {
        backgroundColor: darkBlue,
        background: darkBlue,
        color: white
      },
      filledWarning: {
        backgroundColor: 'orange',
        background: 'orange',
        color: white
      },
    }
  },
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }) => ({
        size: 16,
        color: theme.palette.text.default,
        "&.Mui-checked": {
          color: theme.palette.text.secondary,
        },
        '& .MuiSvgIcon-root': {
          fontSize: 20,
        },
      }),
      
    }
  },
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-checked': {
          color: theme.palette.icon.fill.select, // color when checked
        },
        '&.MuiCheckbox-indeterminate': {
          color: theme.palette.icon.fill.select, // color when indeterminate
        },
      }),
    },
  },
  MuiInput: {
    styleOverrides: {
      input: ({ theme }) => ({
        ...typographyVariants.bodyMedium,
        color: theme.palette.text.secondary
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        background: theme.palette.background.secondary, // Your color here
      }),
      paperAnchorLeft: ({ theme }) => ({
        borderRight: `1px solid ${theme.palette.border.lines}`,
      }),
      paperAnchorRight: ({ theme }) => ({
        borderLeft: `1px solid ${theme.palette.border.lines}`,
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: theme.palette.background.alitaDefault, // Your color here
      }),
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: ({ theme }) => ({
        ...typographyVariants.labelSmall,
        color: theme.palette.text.secondary,
        height: '16px',
        minWidth: '16px',
        borderRadius: '8px',
        padding: '0px 4.5px',
        background: theme.palette.background.tabButton.active,
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.background.tooltip.default,
        color: theme.palette.text.button.primary,
        ...typographyVariants.labelSmall,
      }),
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.secondary,
        border: `1px solid ${theme.palette.border.lines}`,
        borderRadius: '8px',
        boxShadow: theme.palette.boxShadow.tagEditorPaper,
      }),
    },
  },
}

const getDesignTokens = mode => ({
  breakpoints: {
    values: {
      prompt_list_xs: 0,
      prompt_list_sm: 600,
      prompt_list_full_width_sm: 1024,
      prompt_list_md: 1366,
      prompt_list_lg: 1440,
      prompt_list_xl: 1800,
      prompt_list_xxl: 2560,
      prompt_list_xxxl: 3440,
      prompt_list_xxxxl: 3840,
      prompt_list_xxxxxl: 5120,
      tablet: 1024,
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Montserrat", Roboto, Arial, sans-serif',
    fontFeatureSettings: '"clig" 0, "liga" 0',
    ...typographyVariants
  },
  palette: mode === 'dark' ? darkPalette : lightPalette,
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'alita' },
          style: ({ theme, color }) => alitaButtonStyle(theme, color),
        }
      ],
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          background: theme.palette.background.secondary,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: theme.palette.border.lines,
          boxShadow: '0px 0px 23.6px 0px #FFFFFF0D'
        })
      },
      
    },
    ...components,
  },
});

export default getDesignTokens;