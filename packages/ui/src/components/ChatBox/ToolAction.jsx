
import {Box, Button, Divider, Typography} from '@mui/material';
import { AccordionShowMode, StyledAccordion, StyledAccordionSummary, StyledAccordionDetails } from '../BasicAccordion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@emotion/react';
import CheckedIcon from '@/assets/checked-icon.svg?react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useMemo, useCallback, useState, useEffect } from 'react';
import AttentionIcon from '@/components/Icons/AttentionIcon';
import { StyledCircleProgress } from './StyledComponents';
import CancelIcon from '@/components/Icons/CancelIcon';
import StyledInputEnhancer from '../StyledInputEnhancer';
import { ToolActionStatus } from '@/common/constants';
import StyledTooltip from '../Tooltip';
import CopyIcon from '@/components/Icons/CopyIcon';
import useToast from '../useToast';
import Markdown from "@/components/Markdown.jsx";
import { useGetComponentWidth } from '@/pages/hooks';

export const StyledExpandMoreIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
}));

const Status = ({ status }) => {
  const theme = useTheme();
  switch (status) {
    case ToolActionStatus.complete:
      return <CheckedIcon sx={{ width: '16px', height: '16px' }} fill={theme.palette.status.published} />
    case ToolActionStatus.error:
      return <ErrorOutlineIcon sx={{ width: '16px', height: '16px', color: theme.palette.status.rejected }} />
    case ToolActionStatus.actionRequired:
      return <AttentionIcon width={16} height={16} fill={theme.palette.status.onModeration} />
    case ToolActionStatus.cancelled:
      return <CancelIcon width={16} height={16} fill={theme.palette.icon.fill.default} />
    case ToolActionStatus.processing:
      return <Box sx={{ width: '16px', height: '16px' }}> <StyledCircleProgress size={16} sx={{ color: theme.palette.text.info }} /></Box>
    default:
      return <CheckedIcon sx={{ width: '16px', height: '16px' }} fill={theme.palette.status.published} />
  }
}

const CONTENT_STEP_LEN = 1024

const ToolInputsSection = ({toolInputs, width}) => {
  const displayedInputs = useMemo(() => {
    if (typeof toolInputs === 'object') {
      return '```json\n' + JSON.stringify(toolInputs, null, 2) + '\n```';
    }
  }, [toolInputs]);
  
  if (!displayedInputs) {
    return null
  }
  
  return (
    <>
      <Typography variant={"subtitle1"}>Tool inputs:</Typography>
      <Box width={width ? `${width - 24}px` : '100%'} overflow={'scroll'}>
        <Markdown>
          {displayedInputs}
        </Markdown>
      </Box>
      <Divider sx={{mb: 5}} variant={"fullWidth"}/>
    </>
  )
}

export default function ToolAction({ showMode = AccordionShowMode.RightMode, defaultExpanded = false, action }) {
  const [result, setResult] = useState()
  const [displayContentLen, setDisplayContentLen] = useState(CONTENT_STEP_LEN)
  const {toastInfo} = useToast();
  const [expanded, setExpanded] = useState(defaultExpanded)
  const theme = useTheme();
  const nameColor = useMemo(() => action.status === ToolActionStatus.error
      ?
      theme.palette.status.rejected
      :
      action.status === ToolActionStatus.actionRequired
        ?
        theme.palette.status.onModeration
        :
        theme.palette.text.secondary,
    [action.status, theme.palette.status.onModeration, theme.palette.status.rejected, theme.palette.text.secondary])
  const { componentRef, componentWidth} =  useGetComponentWidth()
  const handleChange = useCallback((event) =>
      setResult(event.target.value),
    []);
  
  const onSubmit = useCallback(
    () => {
      //
    },
    [],
  )
  
  const onCancel = useCallback(
    () => {
      //
    },
    [],
  )
  
  const onExpanded = useCallback(
    (_, value) => {
      setExpanded(value);
      if (!value) {
        setDisplayContentLen(CONTENT_STEP_LEN)
      }
    },
    [],
  )
  
  const onCopy = useCallback(
    async () => {
      await navigator.clipboard.writeText(action.query);
      toastInfo('The content has been copied to the clipboard');
    },
    [action.query, toastInfo],
  )
  
  const onShowMore = useCallback(
    () => {
      setDisplayContentLen(prev => prev + CONTENT_STEP_LEN)
    },
    [],
  )
  
  const onShowLess = useCallback(
    () => {
      setDisplayContentLen(CONTENT_STEP_LEN)
    },
    [],
  )
  
  const onShowAll = useCallback(
    () => {
      setDisplayContentLen(action.content?.length)
    },
    [action.content?.length],
  )
  
  useEffect(() => {
    if (action.status === ToolActionStatus.actionRequired || action.status === ToolActionStatus.error) {
      setExpanded(true);
    }
  }, [action.status])
  
  return (
    <StyledAccordion
      showMode={showMode}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onChange={onExpanded}
      ref={componentRef}
      sx={{
        borderBottom: `1px solid ${theme.palette.border.lines}`,
        '&.Mui-expanded': {
          margin: '0px 0;'
        },
        width: '100%',
      }}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <StyledAccordionSummary
        expandIcon={<StyledExpandMoreIcon sx={{ width: '22px', height: '22px' }} />}
        aria-controls={'panel-content'}
        // id={'panel-header'}
        showMode={showMode}
        sx={{
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <Status status={action.status} />
          <Typography variant='bodyMedium' sx={{ color: nameColor }}>{action.name}</Typography>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails
        sx={{
          paddingBottom: '16px',
          paddingLeft: '12px',
          paddingRight: '12px',
          gap: '12px',
          width: '100%',
        }}
      >
        <ToolInputsSection toolInputs={action.toolInputs} width={componentWidth}/>
        <Box sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap', width: componentWidth ? `${componentWidth - 24}px` : '100%', overflow: 'scroll'}}>
          {action.content?.slice(0, displayContentLen)}
        </Box>
        {action.content?.length > CONTENT_STEP_LEN &&
          <Box marginTop='8px' marginBottom='10px' display='flex' justifyContent='flex-end' gap='16px'>
            { displayContentLen < action.content?.length &&
              <Typography onClick={onShowAll} variant='bodySmall' sx={{ color: theme.palette.text.button.showMore, cursor: 'pointer' }}>
                Show all
              </Typography>
            }
            {displayContentLen > CONTENT_STEP_LEN &&
              <Typography onClick={onShowLess} variant='bodySmall' sx={{ color: theme.palette.text.button.showMore, cursor: 'pointer' }}>
                Show less
              </Typography>
            }
            <Typography
              onClick={displayContentLen < action.content?.length ? onShowMore : null}
              variant='bodySmall'
              sx={{
                color: displayContentLen < action.content?.length ?
                  theme.palette.text.button.showMore :
                  theme.palette.text.button.disabled,
                cursor: displayContentLen < action.content?.length ? 'pointer' : 'default'
              }}
            >
              Show more...
            </Typography>
          </Box>
        }
        {
          action.status === 'action_required' &&
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                cursor: 'pointer',
                '&:hover #CopyButton': {
                  visibility: 'visible',
                },
              }}>
              <Typography variant='bodyMedium' sx={{ color: theme.palette.text.secondary }}>
                {action.query}
              </Typography>
              <StyledTooltip title={'Copy to clipboard'} placement="top">
                <Box id='CopyButton' sx={{ marginRight: '20px', visibility: 'hidden' }} onClick={onCopy}>
                  <CopyIcon sx={{ fontSize: '1rem' }} />
                </Box>
              </StyledTooltip>
            </Box>
            <StyledInputEnhancer
              onChange={handleChange}
              value={result}
              showexpandicon='true'
              id='prompt-desc'
              label={'Result'}
              multiline
              maxRows={15}
              containerProps={{
                sx: { marginRight: '12px' }
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button variant='alita' color='primary'  disabled={!result} onClick={onSubmit} >
                Submit
              </Button>
              <Button variant='alita' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        }
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}