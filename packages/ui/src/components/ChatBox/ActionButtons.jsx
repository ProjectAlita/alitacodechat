import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import StyledTooltip from '../Tooltip';
import AutoScrollToggle from './AutoScrollToggle';
import {
  ActionButton
} from './StyledComponents';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DarkLightIcon from "@/components/Icons/DarkLightIcon.jsx";
import {useDispatch} from "react-redux";
import {useCallback} from "react";
import { actions as settingsActions } from '@/slices/settings';

export default function ActionButtons({
  isStreaming,
  onStopAll,
  onRefresh,
  providerConfig,
  modelSettings,
  mode
}) {
  const dispatch = useDispatch();
  
  const onSwithTheme = useCallback(() => {
    dispatch(settingsActions.switchMode());
  }, [dispatch]);
  return (
    <>
      {isStreaming &&
        <StyledTooltip title={'Stop generating'} placement="top">
          <ActionButton onClick={onStopAll}>
            <StopCircleOutlinedIcon sx={{ fontSize: '1.13rem' }} color="icon" />
          </ActionButton>
        </StyledTooltip>}
      <StyledTooltip title={<span style={{ whiteSpace: 'pre-line' }}>`Reload Elitea Code settings, prompt and datasource options.<br/><br/>
        Current settings:<br/>
        LLM Auth Token: {providerConfig.token && providerConfig.token.slice(0, 4)}...{providerConfig.token && providerConfig.token.slice(-4)}<br/>
        LLM Server URL: {providerConfig.url}<br/>
        Provider API: {providerConfig.apiUrl}<br/>
        Socket Host: {providerConfig.socketHost}<br/>
        Socket Path: {providerConfig.socketPath}<br/>
        LLM model name: {modelSettings && modelSettings.model.model_name}<br/>
        Theme: {mode}</span>} placement="top">
        <ActionButton onClick={onRefresh}>
          <RefreshOutlinedIcon sx={{ fontSize: '1.13rem' }} color="icon" />
        </ActionButton>
      </StyledTooltip>
      <AutoScrollToggle />
      <StyledTooltip title={'Switch Dark/Light theme'} placement="top">
        <ActionButton onClick={onSwithTheme}>
          <DarkLightIcon sx={{ fontSize: '1.13rem' }} color="icon" />
        </ActionButton>
      </StyledTooltip>
    </>
  )
}