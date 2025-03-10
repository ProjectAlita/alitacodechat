import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import StyledTooltip from '../Tooltip';
import AutoScrollToggle from './AutoScrollToggle';
import {
  ActionButton
} from './StyledComponents';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

export default function ActionButtons({
  isStreaming,
  onStopAll,
  onRefresh,
  providerConfig,
  modelSettings
}) {
  const { ioHost, ...newIOConfig } = (providerConfig.ioConfig || {});
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
        LLM model name: {modelSettings && modelSettings.model.model_name}<br/><br/>
        <b>IOConfig from file:</b> {JSON.stringify(providerConfig.ioConfig)}<br/><br/>
        <b>IOConfig merged:</b> {JSON.stringify(Object.assign({
          transports: ["polling"],
          rejectUnauthorized: false,
          path: providerConfig.socketPath,
          reconnectionDelayMax: 2000,
          extraHeaders: {'Authorization': `Bearer ${providerConfig.token}`}
        }, newIOConfig))}`</span>} placement="top">
        <ActionButton onClick={onRefresh}>
          <RefreshOutlinedIcon sx={{ fontSize: '1.13rem' }} color="icon" />
        </ActionButton>
      </StyledTooltip>
      <AutoScrollToggle />
    </>
  )
}