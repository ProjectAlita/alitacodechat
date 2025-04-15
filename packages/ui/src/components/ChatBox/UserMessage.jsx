import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

// import { useSelector } from 'react-redux';
import UserAvatar from '@/components/UserAvatar';
import CopyIcon from '../Icons/CopyIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import StyledTooltip from '../Tooltip';
import CopyMoveIcon from '../Icons/CopyMoveIcon';
import IconButton from '@mui/material/IconButton';

const UserMessageContainer = styled(ListItem)(() => `
  flex: 1 0 0
  display: flex;
  padding: 0.75rem;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 0.25rem;
  margin-bottom: 8px;
`);

const Message = styled(Box)(({ theme }) => `
  flex: 1 0 0;
  color: ${theme.palette.text.secondary};
`);

const ButtonsContainer = styled(Box)(({ theme }) => `
position: absolute;
top: 6px;
right: 6px;
display: flex;
justify-content: flex-end;
align-items: flex-start;
gap: 0.5rem;
padding-left: 32px;
padding-bottom: 2px;
background: ${theme.palette.background.userMessageActions};
`);

const UserMessage = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const { content, onCopy, onCopyToMessages, onDelete, created_at } = props;
  // const avatar = useSelector((state) => state.user?.avatar);
  const avatar = null;
  // const userName = useSelector((state) => state.user?.name);
  const userName = 'User';
  const [showActions, setShowActions] = useState(false);
  const onMouseEnter = useCallback(
    () => {
      setShowActions(true);
    },
    [],
  )
  const onMouseLeave = useCallback(
    () => {
      setShowActions(false);
    },
    [],
  )

  return (
    <UserMessageContainer
      sx={{ flexDirection: 'column', gap: '8px', padding: '12px 0px 12px 0px ' }}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0px 4px 0px 4px' }}>
        <ListItemAvatar sx={{ minWidth: '24px' }}>
          <UserAvatar name={userName} avatar={avatar} size={24} />
        </ListItemAvatar>
        <Typography variant='bodySmall'>
          {formatDistanceToNow(new Date(created_at)) + ' ago'}
        </Typography>
      </Box>
      <Message sx={{
        background: theme.palette.background.aiAnswerBkg,
        width: '100%',
        borderRadius: '8px',
        padding: '12px 16px 12px 16px',
        position: 'relative'
      }}>
        {
          content.split('\n').map((string, index) =>
          (<Box key={index}>
            <Typography sx={{
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'break-word'
            }} variant='bodyMedium'>
              {string}
            </Typography>
          </Box>))
        }
        {showActions && <ButtonsContainer sx={{ top: '4px', background: theme.palette.background.aiAnswerActions }}>
          {
            onCopy &&
            <StyledTooltip title={'Copy to clipboard'} placement="top">
              <IconButton onClick={onCopy}>
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
            onDelete &&
            <StyledTooltip title={'Delete'} placement="top">
              <IconButton onClick={onDelete}>
                <DeleteIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </StyledTooltip>
          }
        </ButtonsContainer>}
      </Message>
    </UserMessageContainer>
  )
})

UserMessage.displayName = 'UserMessage';


export default UserMessage;