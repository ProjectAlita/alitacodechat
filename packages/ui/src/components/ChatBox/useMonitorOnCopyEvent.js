import {useCallback, useRef, useState, useEffect, useContext} from 'react'
import { v4 as uuidv4 } from 'uuid';
import DataContext from "@/context/DataContext.jsx";


export const useInteractionUUID = () => {
  const firstRender = useRef(true)
  const [interaction_uuid, setInteractionUUID] = useState('')

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!interaction_uuid) {
        setInteractionUUID(uuidv4())
      }
    }
  }, [interaction_uuid])
  return {
    interaction_uuid
  }
}

export default function useMonitorOnCopyEvent({ interaction_uuid, onCopy }) {
  const { providerConfig } = useContext(DataContext);

  const onMonitorCopy = useCallback(
    (_event, copyEvent = 'manual_copy') => {
      fetch(`${providerConfig.apiUrl}/monitoring_hub/acceptance/default/${providerConfig.projectId}`, {
        headers: {
          "accept": "*/*",
          "accept-language": "en,ru;q=0.9,ru-RU;q=0.8",
          "content-type": "application/json",
        },
        body: JSON.stringify({ interaction_uuid, acceptance_event: copyEvent }),
      });
    },
    [interaction_uuid, providerConfig],
  )

  const onClickCopy = useCallback(
    () => {
      onCopy && onCopy()
      onMonitorCopy(null, 'button_copy')
    },
    [onCopy, onMonitorCopy],
  )

  return {
    onMonitorCopy,
    onClickCopy
  }
}