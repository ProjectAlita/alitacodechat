
import { Box, Typography } from '@mui/material';
import { AccordionShowMode, StyledAccordion, StyledAccordionSummary, StyledAccordionDetails } from '../BasicAccordion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@emotion/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useCallback, useState } from 'react';

export const StyledExpandMoreIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
}));


export default function AgentException({ exception, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const theme = useTheme();
  const onExpanded = useCallback(
    (_, value) => {
      setExpanded(value);
    },
    [],
  )
  
  return (
    <StyledAccordion
      showMode={AccordionShowMode.RightMode}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onChange={onExpanded}
      sx={{
        '&.Mui-expanded': {
          margin: '0px 0;'
        },
        background: `transparent !important`,
        borderBottom: `1px solid ${theme.palette.border.lines}`,
      }}
    >
      <StyledAccordionSummary
        expandIcon={<StyledExpandMoreIcon sx={{ width: '22px', height: '22px' }} />}
        aria-controls={'panel-content'}
        id={'panel-header'}
        showMode={AccordionShowMode.RightMode}
        sx={{
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <ErrorOutlineIcon sx={{ width: '16px', height: '16px', color: theme.palette.status.rejected }} />
          <Typography variant='bodyMedium' sx={{ color: theme.palette.status.rejected }}>Agent Exception</Typography>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails
        sx={{
          paddingBottom: '16px',
          paddingLeft: '12px',
          gap: '12px'
        }}
      >
        <Typography variant='bodyMedium' sx={{ color: theme.palette.text.secondary }}>
          {exception}
        </Typography>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}