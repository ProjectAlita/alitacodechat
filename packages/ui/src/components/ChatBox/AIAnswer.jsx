import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import { styled, useTheme } from '@mui/material/styles';
import Markdown from '../Markdown';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import RegenerateIcon from '../Icons/RegenerateIcon';
import StyledTooltip from '../Tooltip';
import CopyMoveIcon from '../Icons/CopyMoveIcon';
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import BasicAccordion from "@/components/BasicAccordion.jsx";
import AnimatedProgress from '@/components/AnimatedProgress';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

import { ChatTypes } from '@/common/constants';
import ApplicationsIcon from '@/components/Icons/ApplicationsIcon';
import ConsoleIcon from '@/components/Icons/ConsoleIcon';
import DatabaseIcon from '@/components/Icons/DatabaseIcon';
import ModelIcon from '@/components/Icons/ModelIcon';
import { formatDistanceToNow } from 'date-fns';
import useMonitorOnCopyEvent from "@/components/ChatBox/useMonitorOnCopyEvent.js";

export const getIcon = (type, isActive, theme, showBigIcon = false) => {
  switch (type) {
    case ChatTypes.prompt:
      return <ConsoleIcon fontSize='16px' fill={isActive ? theme.palette.icon.fill.tips : theme.palette.icon.fill.default} />
    case ChatTypes.datasource:
      return <DatabaseIcon fontSize='16px' sx={{ color: isActive ? theme.palette.icon.fill.tips : theme.palette.icon.fill.default }} />
    case ChatTypes.application:
      return <ApplicationsIcon fontSize='16px' fill={isActive ? theme.palette.icon.fill.tips : theme.palette.icon.fill.default}/>
    default:
      return <ModelIcon width={showBigIcon ? 24 : 16} height={showBigIcon ? 24 : 16} fill={isActive ? theme.palette.icon.fill.tips : theme.palette.icon.fill.default} />
  }
}

export const UserMessageContainer = styled(ListItem)(() => ({
  flex: '1 0 0',
  display: 'flex',
  padding: '0.75rem',
  alignItems: 'flex-start',
  gap: '1rem',
  alignSelf: 'stretch',
  borderRadius: '0.25rem',
  '&:not(:last-of-type)': {
    marginBottom: '8px',
  },
}));

export const Answer = styled(Box)(({ theme }) => `
  min-height: 36px; 
  flex: 1 0 0;
  color:${theme.palette.text.secondary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
  background: transparent;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

const AIAnswerContainer = styled(UserMessageContainer)(({ theme }) => `
  background: ${theme.palette.background.aiAnswerBkg};
`);

export const ButtonsContainer = styled(Box)(({ theme }) => `
position: absolute;
top: 6px;
right: 6px;
display: flex;
justify-content: flex-end;
align-items: flex-start;
gap: 0.5rem;
padding-left: 32px;
padding-bottom: 2px;
background: ${theme.palette.background.aiAnswerActions};
`);

export const ReferenceList = ({ references }) => {
  return (
    <List dense>
      {
        references.map(i => (
          <ListItem key={i}>
            <ListItemText
              primary={<Markdown>{i}</Markdown>}
            />
          </ListItem>
        ))
      }
    </List>
  )
}

const AIAnswer = React.forwardRef((props, ref) => {
  const {
    answer,
    hasActions = true,
    onCopy,
    onCopyToMessages,
    onDelete,
    onRegenerate,
    shouldDisableRegenerate,
    references = [],
    isLoading = false,
    isStreaming,
    onStop,
    participant,
    created_at,
    interaction_uuid,
  } = props
  const theme = useTheme();
  const [showActions, setShowActions] = useState(false);
  const onMouseEnter = useCallback(
    () => {
      if (hasActions) {
        setShowActions(true);
      }
    },
    [hasActions],
  )
  const onMouseLeave = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )
  const { onMonitorCopy, onClickCopy } = useMonitorOnCopyEvent({ interaction_uuid, onCopy })

  return (
    <AIAnswerContainer
      onCopy={onMonitorCopy}
      sx={{ flexDirection: 'column', gap: '8px', padding: '12px 0px 12px 0px', background: 'transparent' }}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px 4px 0px 4px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', height: '100%', maxWidth: 'calc(100% - 150px)', overflow: 'hidden' }}>
          <Box sx={{ minWidth: '24px', height: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', background: theme.palette.background.aiParticipantIcon }}>
            {getIcon(participant.type, true, theme, false)}
          </Box>
          <Typography
            variant='bodySmall'
            sx={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
            }}
            color='secondary'>
            {participant.name || participant.model_name}
          </Typography>
        </Box>
        <Typography variant='bodySmall'>
          {formatDistanceToNow(new Date(created_at)) + ' ago'}
        </Typography>
      </Box>
      <Answer sx={{
        background: theme.palette.background.aiAnswerBkg,
        width: '100%',
        borderRadius: '8px',
        padding: '12px 16px 12px 16px',
        position: 'relative',
        boxSizing: 'border-box',
        minHeight: '48px',
        flex: 1,
      }}>
        {showActions && <ButtonsContainer>
          {
            isStreaming &&
            <StyledTooltip title={'Stop generating'} placement="top">
              <IconButton onClick={onStop}>
                <StopCircleOutlinedIcon sx={{ fontSize: '1.3rem' }} color="icon" />
              </IconButton>
            </StyledTooltip>
          }
          {
            onCopy && <StyledTooltip title={'Copy to clipboard'} placement="top">
              <IconButton onClick={onClickCopy}>
                <CopyIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
          {
            onCopyToMessages &&
            <StyledTooltip title={'Copy to Messages'} placement="top">
              <IconButton onClick={onCopyToMessages}>
                <CopyMoveIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
          {
            onRegenerate &&
            <StyledTooltip title={'Regenerate'} placement="top">
              <div>
                <IconButton disabled={shouldDisableRegenerate} onClick={onRegenerate} >
                  <RegenerateIcon sx={{ fontSize: '1.13rem' }} />
                </IconButton>
              </div>
            </StyledTooltip>
          }
          {
            onDelete &&
            <StyledTooltip title={'Delete'} placement="top">
              <IconButton onClick={onDelete}>
                <DeleteIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
        </ButtonsContainer>}
        <Markdown interaction_uuid={interaction_uuid}>
          {answer}
        </Markdown>
        {isLoading && <AnimatedProgress
          sx={{
            fontWeight: "400",
            fontSize: "18px",
            lineHeight: "32px",
          }}
          message='Thinking...'
          duration='2s'
        />}
        {references?.length > 0 && <BasicAccordion style={{ marginTop: answer ? '15px' : '37px' }} items={[
          { title: 'References', content: <ReferenceList references={references} /> }
        ]} />}
      </Answer>
    </AIAnswerContainer>
  )
})

AIAnswer.displayName = 'AIAnswer'

export default AIAnswer;