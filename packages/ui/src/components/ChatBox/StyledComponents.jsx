import { filterProps } from '@/common/utils';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

export const StyledUnfoldLessIcon = styled(UnfoldLessIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const StyledUnfoldMoreIcon = styled(UnfoldMoreIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const ChatBoxContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  paddingBottom: '1rem',
}));

export const StyledButton = styled(Button)(({ first, selected, theme }) => (`
  text-transform: none;
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius:${first ? '0.5rem 0rem 0rem 0.5rem' : '0rem 0.5rem 0.5rem 0rem'};
  background:${selected ? theme.palette.background.tabButton.active : theme.palette.background.tabButton.default};
  color:${selected ? theme.palette.text.secondary : theme.palette.text.primary};
  border-right: 0px !important;
`));

export const ActionContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '12px',
  flex: '0 0 auto',
}));

export const ActionButton = styled(IconButton)(() => (`
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
`));

export const ToggleButton = styled(IconButton,
  filterProps('isAutoScroll'))(({ theme, isAutoScroll }) => ({
  width: '28px',
  height: '28px',
  background: isAutoScroll ?
    theme.palette.background.categoriesButton.selected.active :
    theme.palette.background.icon.default,
  '&:hover': {
    background: isAutoScroll ?
      theme.palette.background.categoriesButton.selected.hover :
      undefined
  }
}));

export const RunButton = styled(Button)(({ theme }) => (`
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.75rem;
  background: ${theme.palette.primary.main};
  &:hover {
    background: ${theme.palette.primary.main};
  }
  &.Mui-disabled {
    background-color: ${theme.palette.text.primary};
  }

  color: ${theme.palette.text.button.primary};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem; /* 133.333% */
  text-transform: none;

`));

export const ChatBodyContainer = styled(Box)(({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  flex-grow: 1;
  align-self: stretch;

  position: relative;

  border-radius: 0.5rem;
  border: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.alitaDefault};
`);

export const ParticipantContainer = styled(Box)(({ theme }) => ({
  padding: '8px 12px' ,
  display: 'flex' ,
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  borderTop: `1px solid ${theme.palette.border.activeBG}`,
}))

export const ChatInputContainer = styled(Box)(({ theme }) => `
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.75rem 1rem;
  align-items: flex-start;
  border-radius: 0rem 0rem 0.375rem 0.375rem;
  border-top: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.userInputBackground};
`);

export const StyledTextField = styled(TextField)(() => ({
  flex: `1 0 0`,
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '1.375rem',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none', /* IE and Edge */
  scrollbarWidth: 'none',
  '& textarea::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const SendButtonContainer = styled(Box)(() => (`
  position: relative;
  display: flex;
  height: auto;
  align-items: center;
  justify-content: center;
`));

export const SendButton = styled(IconButton)(({ theme }) => (`
  display: flex;
  padding: 0.375rem;
  align-items: center;
  border-radius: 1.75rem;
  background: ${theme.palette.primary.main};
  &.Mui-disabled {
    background-color: ${theme.palette.text.primary};
  }
  &:hover {
    background: ${theme.palette.primary.main}
  }
`));

export const StyledCircleProgress = styled(CircularProgress)(() => `
  position: absolute;
  z-index: 999;
  margin-left: -1.4px;
  margin-top: 1px;
`);

export const MessageList = styled(List)(() => `
  width: 100%;
  flex-grow: 1;
  height: 20.25rem;
  padding: 0.75rem;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

export const CompletionContainer = styled(Box)(() => `
  padding: 0.75rem;
  width: 100%;
  height: 24.25rem;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

export const Message = styled(Box)(() => `
  flex: 1 0 0;
  color: #FFF;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
`);
