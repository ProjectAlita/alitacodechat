/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
import { ROLES, sioEvents, SocketMessageType, ChatTypes, ToolActionStatus } from '@/common/constants';
import { VsCodeMessageTypes } from 'shared';
import { buildErrorMessage, convertJsonToString } from '@/common/utils';
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import AlertDialog from '../AlertDialog';
import AIAnswer from './AIAnswer';
import ChatInput from './ChatInput';
import {
  ActionButton,
  ActionContainer,
  ChatBoxContainer,
  MessageList
} from './StyledComponents';
import UserMessage from "./UserMessage";
import useDeleteMessageAlert from './useDeleteMessageAlert';
import useSocket, { useManualSocket } from '@/hooks/useSocket';
import { AUTO_SCROLL_KEY } from './AutoScrollToggle';
import { Box } from '@mui/material'
import ActionButtons from './ActionButtons';
import { useStopStreaming } from './hooks';
import ClearIcon from '../Icons/ClearIcon';
import DataContext from '@/context/DataContext';
import ApplicationAnswer from './ApplicationAnswer';
import useToast from "@/components/useToast.jsx";
import { useInteractionUUID } from "@/components/ChatBox/useMonitorOnCopyEvent.js";

const USE_STREAM = true
const MESSAGE_REFERENCE_ROLE = 'reference'

export const generateApplicationPayload = ({
                                             projectId, application_id, instructions, temperature,
                                             max_tokens, top_p, top_k, model_name, integration_uid,
                                             variables, tools, name, currentVersionId, question_id
                                           }) => ({
  application_id,
  user_name: name,
  project_id: projectId,
  version_id: currentVersionId,
  instructions,
  llm_settings: {
    temperature,
    max_tokens,
    top_p,
    top_k,
    model_name,
    integration_uid,
  },
  variables: variables ? variables.map((item) => {
    const {key, name: variableName, value} = item;
    return {
      name: variableName || key,
      value,
    }
  }) : [],
  tools,
  question_id,
})

export const generateApplicationStreamingPayload = ({
                                                      projectId,
                                                      application_id,
                                                      instructions,
                                                      temperature,
                                                      max_tokens,
                                                      top_p,
                                                      top_k,
                                                      model_name,
                                                      integration_uid,
                                                      variables,
                                                      question,
                                                      tools,
                                                      chatHistory,
                                                      name,
                                                      currentVersionId,
                                                      question_id,
                                                      interaction_uuid,
                                                    }) => {
  const payload = generateApplicationPayload({
    projectId, application_id, instructions, temperature,
    max_tokens, top_p, top_k, model_name, integration_uid,
    variables, tools, name, currentVersionId, question_id
  })
  payload.thread_id = chatHistory?.at(-1)?.threadId
  payload.chat_history = chatHistory ? chatHistory.map((message) => {
    const {role, content, name: userName} = message;
    if (userName) {
      return {role, content, name: userName};
    } else {
      return {role, content}
    }
  }) : []
  payload.user_input = question
  payload.question_id = question_id
  payload.interaction_uuid = interaction_uuid
  return payload
}

const getDefaultModel = (model = {}, modelsList) => {
  const { model_name = '', integration_uid = '' } = model;
  const modelAndIntegrationExists = modelsList.find(item => item.integration_uid === integration_uid && item.model_name === model_name)
  if (modelAndIntegrationExists) {
    return {
      model_name,
      integration_uid,
    }
  } else {
    const modelExists = modelsList.find(item => item.model_name === model_name)
    if (modelExists) {
      return {
        model_name,
        integration_uid: modelExists.integration_uid,
      }
    }
    return {
      model_name: modelsList[0]?.model_name || '',
      integration_uid: modelsList[0]?.integration_uid || '',
    }
  }
}


const generatePayload = ({
  projectId, prompt_id, type, name, variables, currentVersionId, model_settings
}) => ({
  prompt_id,
  projectId,

  user_name: name,
  project_id: projectId,
  prompt_version_id: currentVersionId,
  model_settings,

  type,
  variables: variables ? variables.map(({ name: key, value }) => ({
    name: key,
    value,
  })) : [],
  format_response: true,
})

const generateChatPayload = ({
  projectId, prompt_id, question, messages, variables, chatHistory, name, currentVersionId, model_settings, interaction_uuid
}) => {
  const payload = generatePayload({
    projectId, prompt_id, type: 'chat', variables, name, currentVersionId, model_settings
  })
  payload.chat_history = chatHistory ? chatHistory.map((message) => {
    const { role, content, name: userName } = message;
    if (userName) {
      return { role, content, name: userName };
    } else {
      return { role, content }
    }
  }) : []
  payload.user_input = question
  if (messages) {
    payload.messages = messages
  }
  payload.interaction_uuid = interaction_uuid;
  return payload
}

const ChatBox = forwardRef(({
  messageListSX,
}, boxRef) => {
  const {
    ToastComponent,
    toastError,
    toastInfo,
  } = useToast();
  const {
    isLoading,
    postMessageToVsCode,
    chatHistory = [],
    setChatHistory = () => { },
    loadCoreData,
    deployments
  } = useContext(DataContext);
  const chatInput = useRef(null);
  const listRefs = useRef([]);
  const messagesEndRef = useRef();
  const name = 'User';

  const [isRegenerating, setIsRegenerating] = useState(false);
  const chatHistoryRef = useRef(chatHistory);
  const [chatWith, setChatWith] = useState('');
  const [participant, setParticipant] = useState(null);
  const participantRef = useRef(participant);
  const chatWithRef = useRef(chatWith);
  
  const { interaction_uuid } = useInteractionUUID();

  useEffect(() => {
    participantRef.current = participant
  }, [participant])


  useEffect(() => {
    chatWithRef.current = chatWith
  }, [chatWith])

  const {
    openAlert,
    alertContent,
    onDeleteAnswer,
    onDeleteAll,
    onConfirmDelete,
    onCloseAlert
  } = useDeleteMessageAlert({
    setChatHistory,
    chatInput,
  });

  const onClickClearChat = useCallback(() => {
    if (chatHistory.length) {
      onDeleteAll();
    }
  }, [chatHistory.length, onDeleteAll])

  useImperativeHandle(boxRef, () => ({
    onClear: onClickClearChat,
  }));

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  const getMessage = useCallback((messageId) => {
    const msgIdx = chatHistoryRef.current?.findIndex(i => i.id === messageId) || -1;
    let msg
    if (msgIdx < 0) {
      msg = {
        id: messageId,
        role: ROLES.Assistant,
        content: '',
        isLoading: false,
        participant: participantRef.current,
        created_at: new Date().getTime()
      }
    } else {
      msg = chatHistoryRef.current[msgIdx]
    }
    return [msgIdx, msg]
  }, [])

  const handleError = useCallback(
    (errorObj) => {
      toastError(buildErrorMessage(errorObj));
      if (isRegenerating) {
        setIsRegenerating(false);
      }
    },
    [isRegenerating, toastError],
  )

  const scrollToMessageListEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [])

  const handleSocketEvent = useCallback(async message => {
    const { stream_id, message_id, type: socketMessageType, message_type, response_metadata } = message
    const { task_id } = message.content instanceof Object ? message.content : {}
    const [msgIndex, msg] = getMessage(stream_id || message_id, message_type)

    const scrollToMessageBottom = () => {
      if (sessionStorage.getItem(AUTO_SCROLL_KEY) === 'true') {
        const messageElement = listRefs.current[msgIndex]
        if (messageElement) {
          const parentElement = messageElement.parentElement;
          messageElement.scrollIntoView({ block: "end" });
          if (parentElement) {
            parentElement.scrollTop += 12;
          }
        } else {
          scrollToMessageListEnd();
        }
      }
    };
    let t

    switch (socketMessageType) {
      case SocketMessageType.StartTask:
        msg.isLoading = true
        msg.isStreaming = true
        msg.content = ''
        msg.references = []
        msg.task_id = task_id
        msgIndex === -1 ? setChatHistory(prevState => [...prevState, msg]) : setChatHistory(prevState => {
          prevState[msgIndex] = msg
          return [...prevState]
        })
        setTimeout(scrollToMessageBottom, 0);
        break
      case SocketMessageType.Chunk:
      case SocketMessageType.AIMessageChunk:
      case SocketMessageType.AgentResponse:
        msg.content += message.content
        msg.isLoading = false
        setTimeout(scrollToMessageBottom, 0);
        if (response_metadata?.finish_reason) {
          msg.isStreaming = false
        }
        msg.threadId = response_metadata?.thread_id
        break
      case SocketMessageType.AgentLlmChunk:
        t = msg.toolActions.find(i => i.id === message?.response_metadata?.tool_run_id)
        if (t) {
          if (t.content === undefined) {
            t.content = '```json\n'
          }
          t.content += message.content
        }
        break
      case SocketMessageType.AgentLlmEnd:
        t = msg.toolActions.find(i => i.id === message?.response_metadata?.tool_run_id)
        if (t) {
          t.content += '\n```'
          t.status = ToolActionStatus.complete
        }
        break
      case SocketMessageType.AgentLlmStart:
      case SocketMessageType.AgentToolStart:
        if (msg.toolActions === undefined) {
          msg.toolActions = []
        }
        if (!msg.toolActions.find(i => i.id === message?.response_metadata?.tool_run_id)) {
          msg.toolActions.push({
            name: message?.response_metadata?.tool_name,
            id: message?.response_metadata?.tool_run_id,
            status: ToolActionStatus.processing,
            toolInputs: message?.response_metadata?.tool_inputs
          })
        }
        break
      case SocketMessageType.AgentToolEnd:
        t = msg.toolActions.find(i => i.id === message?.response_metadata?.tool_run_id)
        if (t) {
          Object.assign(t, {
            content: convertJsonToString(message?.content ?? ''),
            status: ToolActionStatus.complete
          })
        }
        break
      case SocketMessageType.AgentToolError:
        t = msg.toolActions?.find(i => i.id === message?.response_metadata?.tool_run_id)
        if (t) {
          Object.assign(t, {
            content: convertJsonToString(message?.content ?? ''),
            status: ToolActionStatus.error
          })
        }
        break
      case SocketMessageType.References:
        msg.references = message.references
        setTimeout(scrollToMessageBottom, 0);
        break
      case SocketMessageType.Error:
        msg.isStreaming = false
        handleError({ data: message.content || [] })
        return
      case SocketMessageType.AgentException: {
        msg.isLoading = false
        msg.isStreaming = false;
        msg.exception = message.content;
        break;
      }
      case SocketMessageType.Freeform:
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('unknown message type', socketMessageType)
        return
    }
    msgIndex > -1 && setChatHistory(prevState => {
      prevState[msgIndex] = msg
      return [...prevState]
    })
  }, [getMessage, handleError, scrollToMessageListEnd, setChatHistory])

  const dataContext = useContext(DataContext);
  const { emit, error } = useSocket(
    chatWith === ChatTypes.datasource ?
      sioEvents.datasource_predict :
      chatWith === ChatTypes.application ?
        sioEvents.application_predict :
        sioEvents.promptlib_predict,
    handleSocketEvent
  )
  
  useEffect(() => {
    if (error) {
      toastError(error);
    }
  }, [error, toastError])

  // Message Sending to Extension
  const onClickSend = useCallback((data) => {
    postMessageToVsCode && postMessageToVsCode({
      type: VsCodeMessageTypes.getChatResponse,
      data: {
        ...data,
        chat_history: chatHistory,
      }
    });
    setChatHistory((prevMessages) => {
      return [...prevMessages, {
        ...data,
        id: new Date().getTime(),
        role: ROLES.User,
        name: 'User',
        content: data.user_input,
      }]
    })
    setTimeout(scrollToMessageListEnd, 0);
  }, [chatHistory, postMessageToVsCode, scrollToMessageListEnd, setChatHistory]);

  const onPredictStream = useCallback(async data => {
    setTimeout(scrollToMessageListEnd, 0);

    const { modelSettings, socketConfig, sendMessage } = dataContext

    const selectedText = await sendMessage({
      type: VsCodeMessageTypes.getSelectedText
    });
    const messages = []
    if (selectedText) {
      messages.push({
        role: ROLES.System,
        content: selectedText
      })
    }
    const question = data.user_input;
    setChatHistory((prevMessages) => {
      return [...prevMessages, {
        ...data,
        id: new Date().getTime(),
        role: ROLES.User,
        name,
        content: question,
        created_at: new Date(),
        participant_id: participantRef.current?.id,
        sentTo: participantRef.current ?? {}
      }]
    })

    const projectId = socketConfig?.projectId
    if (!projectId) {
      toastError('Alita Code extension Project ID setting is missing. Please set it to continue chat.');
      return
    }
      
    if (error) {
      toastError(error);
      return;
    }

    if (data.application_id) {
      if (!data.llm_settings?.integration_uid) {
        toastError('Application chat model is missing. Please select another one for chat.');
        return
      }
      const payload = generateApplicationStreamingPayload({
        ...data,
        ...data.llm_settings,
        projectId,
        question,
        name,
        chatHistory,
        interaction_uuid
      })

      emit(payload)
      return
    } else if (data.datasource_id) {
      if (!data.chat_settings_ai?.integration_uid ||
        !data.chat_settings_embedding?.integration_uid) {
        toastError('Datasource chat model and/or embedding setting is missing. Please select another one for chat.');
        return
      }
      emit({
        project_id: projectId,
        version_id: data.currentVersionId || data.datasource_id,
        input: question,
        chat_history: chatHistory.filter(i => i.role !== MESSAGE_REFERENCE_ROLE).concat(messages),
        context: data.context,
        chat_settings_ai: data.chat_settings_ai,
        chat_settings_embedding: data.chat_settings_embedding,
        interaction_uuid
      })
      return
    } else {
      const payloadData = {
        projectId,
        question,
        chatHistory,
        name,
        messages,
        interaction_uuid
      }
      if (data.prompt_id && data.currentVersionId) {
        payloadData.prompt_id = data.prompt_id
        payloadData.currentVersionId = data.currentVersionId
        payloadData.variables = data.variables
      } else {
        if (modelSettings) {
          payloadData.model_settings = modelSettings
          payloadData.model_settings.model = getDefaultModel(modelSettings.model, deployments)
          if (!payloadData.model_settings.model.model_name) {
            toastError('Alita Code extension model settings are missing.');
            return
          } else if (!payloadData.model_settings.model.integration_uid) {
            toastError('Alita Code extension integration Uid is missing.');
            return
          }
        } else {
          toastError('Alita Code extension model settings are missing.');
          return
        }
      }
      const payload = generateChatPayload(payloadData)
      emit(payload)
    }
  },
    [scrollToMessageListEnd, dataContext, setChatHistory, emit, chatHistory, deployments, error, toastError, interaction_uuid])

  const onSend = useCallback(
    (data) => {
      if (USE_STREAM) {
        onPredictStream(data);
      } else {
        onClickSend(data);
      }
    },
    [onClickSend, onPredictStream],
  );

  const { emit: manualEmit } = useManualSocket(
    chatWith === ChatTypes.datasource ?
      sioEvents.datasource_leave_rooms :
      chatWith === ChatTypes.application ?
        sioEvents.application_leave_rooms :
        sioEvents.promptlib_leave_rooms
  );
  const {
    isStreaming,
    onStopAll,
    onStopStreaming
  } = useStopStreaming({
    chatHistoryRef,
    chatHistory,
    setChatHistory,
    manualEmit,
    sendMessage: dataContext.sendMessage
  });

  const onCopyToClipboard = useCallback(
    (id) => async () => {
      const message = chatHistory.find(item => item.id === id);
      if (message) {
        if (message.exception) {
          try {
            await navigator.clipboard.writeText(JSON.stringify(message.exception));
            toastInfo('The exception has been copied to the clipboard');
          } catch (e) {
            toastError('Failed to copy the exception!');
          }
        } else {
          await navigator.clipboard.writeText(message.content);
          toastInfo('The message has been copied to the clipboard');
        }
      }
    },
    [chatHistory, toastInfo, toastError],
  );

  return (
    <>
      <ChatBoxContainer
        role="presentation"
      >
        <ActionContainer>
          <Box display='flex' gap='8px'>
            <ActionButtons
              isStreaming={isStreaming}
              onStopAll={onStopAll}
              onRefresh={loadCoreData}
            />
            <ActionButton
              aria-label="clear the chat"
              disabled={isLoading || isStreaming || !chatHistory.length}
              onClick={onClickClearChat}
            >
              <ClearIcon sx={{ fontSize: 16 }} />
            </ActionButton>
          </Box>
        </ActionContainer>
        <MessageList sx={messageListSX}>
          {
            chatHistory.map((message, index) => {
              if (!message.created_at) {
                message.created_at = new Date()
              }
              return message.role === 'user' ?
                <UserMessage
                  key={message.id}
                  ref={(ref) => (listRefs.current[index] = ref)}
                  content={message.content}
                  onCopy={onCopyToClipboard(message.id)}
                  onDelete={onDeleteAnswer(message.id)}
                  created_at={message.created_at}
                />
                :
                message.participant?.type !== ChatTypes.application ?
                  <AIAnswer
                    key={message.id}
                    ref={(ref) => (listRefs.current[index] = ref)}
                    answer={message.content}
                    participant={message.participant}
                    onStop={onStopStreaming(message)}
                    onCopy={onCopyToClipboard(message.id)}
                    onDelete={onDeleteAnswer(message.id)}
                    shouldDisableRegenerate={isLoading || isStreaming || Boolean(message.isLoading)}
                    references={message.references}
                    isLoading={Boolean(message.isLoading)}
                    isStreaming={message.isStreaming}
                    created_at={message.created_at}
                    interaction_uuid={interaction_uuid}
                  />
                  :
                  <ApplicationAnswer
                    key={message.id}
                    ref={(ref) => (listRefs.current[index] = ref)}
                    answer={message.content}
                    participant={message.participant}
                    onStop={onStopStreaming(message)}
                    onCopy={onCopyToClipboard(message.id)}
                    onDelete={onDeleteAnswer(message.id)}
                    shouldDisableRegenerate={isLoading || isStreaming || Boolean(message.isLoading)}
                    references={message.references}
                    exception={message.exception}
                    toolActions={message.toolActions || []}
                    isLoading={Boolean(message.isLoading)}
                    isStreaming={message.isStreaming}
                    created_at={message.created_at}
                    interaction_uuid={interaction_uuid}
                  />
            })
          }
          <div ref={messagesEndRef} />
        </MessageList>
        <ChatInput
          onSend={onSend}
          ref={chatInput}
          isLoading={isLoading || isStreaming}
          disabledSend={isLoading}
          chatWith={chatWith}
          setChatWith={setChatWith}
          setParticipant={setParticipant}
          shouldHandleEnter />
        <ToastComponent/>
        <AlertDialog
          title='Warning'
          alertContent={alertContent}
          open={openAlert}
          onClose={onCloseAlert}
          onCancel={onCloseAlert}
          onConfirm={onConfirmDelete}
        />
      </ChatBoxContainer>
    </>
  )
});

ChatBox.displayName = 'ChatBox'

ChatBox.propTypes = {}


export default ChatBox;
