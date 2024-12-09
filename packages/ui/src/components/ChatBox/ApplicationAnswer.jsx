import React, {useState, useCallback} from 'react';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Markdown from '../Markdown';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import RegenerateIcon from '../Icons/RegenerateIcon';
import StyledTooltip from '../Tooltip';
import BasicAccordion from "@/components/BasicAccordion.jsx";
import AnimatedProgress from '@/components/AnimatedProgress';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { UserMessageContainer, Answer, ButtonsContainer, ReferenceList, getIcon } from './AIAnswer';
import { useTheme } from '@emotion/react';
import ToolAction from './ToolAction';
import { formatDistanceToNow } from 'date-fns';
import AgentException from './AgentException';
import useMonitorOnCopyEvent from "@/components/ChatBox/useMonitorOnCopyEvent.js";


const ApplicationAnswer = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const {
    answer,
    created_at,
    hasActions = true,
    onCopy,
    onDelete,
    onRegenerate,
    shouldDisableRegenerate,
    references = [],
    toolActions = [],
    isLoading = false,
    isStreaming,
    onStop,
    participant,
    exception,
    interaction_uuid,
  } = props
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
    <UserMessageContainer
      onCopy={onMonitorCopy}
      sx={{ flexDirection: 'column', gap: '8px', padding: '12px 0px 12px 0px', background: 'transparent' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px 4px 0px 4px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            height: '100%',
            maxWidth: 'calc(100% - 150px)',
            overflow: 'hidden'
          }}>
          <Box sx={{
            minWidth: '24px',
            height: '24px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '12px',
            background: theme.palette.background.aiParticipantIcon
          }}>
            {getIcon(participant.type, true, theme, false)}
          </Box>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            variant='bodySmall'
            color='secondary'>
            {participant.name || participant.model_name}
          </Typography>
        </Box>
        <Typography variant='bodySmall'>
          {formatDistanceToNow(new Date(created_at)) + ' ago'}
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        {
          toolActions.map((action) => {
            return <ToolAction action={action} key={action.id} />
          })
        }
        {
          exception && <AgentException exception={exception} />
        }
        <Answer
          sx={{
            background: theme.palette.background.aiAnswerBkg,
            width: '100%',
            borderRadius: '4px',
            padding: '12px 16px 12px 16px',
            position: 'relative',
            marginTop: toolActions.length ? '8px' : '0px',
            minHeight: '48px'
          }}>
          {showActions && <ButtonsContainer sx={{ top: '6px', right: '6px' }}>
            {
              isStreaming &&
              <StyledTooltip title={'Stop generating'} placement="top">
                <IconButton onClick={onStop}>
                  <StopCircleOutlinedIcon sx={{ fontSize: '1.3rem' }} color="icon" />
                </IconButton>
              </StyledTooltip>
            }
            {
              onCopy && !!answer && <StyledTooltip title={'Copy to clipboard'} placement="top">
                <IconButton onClick={onClickCopy}>
                  <CopyIcon sx={{ fontSize: '1.13rem' }} />
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
            {!exception ? answer : 'Agent exception!'}
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
          <div ref={ref} />
          {references?.length > 0 && <BasicAccordion style={{ marginTop: answer ? '15px' : '37px' }} items={[
            { title: 'References', content: <ReferenceList references={references} /> }
          ]} />}
        </Answer>
      </Box>
    </UserMessageContainer>
  )
})

ApplicationAnswer.displayName = 'ApplicationAnswer'

export default ApplicationAnswer;