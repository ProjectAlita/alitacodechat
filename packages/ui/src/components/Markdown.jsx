import { MuiMarkdown, getOverrides } from 'mui-markdown';
import styled from '@emotion/styled';
import Link from '@mui/material/Link';
import { marked } from 'marked'
import { Highlight, themes } from 'prism-react-renderer';
import { Box, useTheme } from '@mui/material';
import Tooltip from '@/components/Tooltip';
import { useCallback, useContext } from 'react';
import DataContext from '@/context/DataContext';
import { VsCodeMessageTypes } from 'shared';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useMonitorOnCopyEvent from "@/components/ChatBox/useMonitorOnCopyEvent.js";

const MarkdownMapping = {
  h1: {
    component: 'h1',
    props: {
    },
  },
  h2: {
    component: 'h2',
    props: {
    },
  },
  h3: {
    component: 'h3',
    props: {
    },
  },
  h4: {
    component: 'h4',
    props: {
    },
  },
  h5: {
    component: 'h5',
    props: {
    },
  },
  h6: {
    component: 'h6',
    props: {
    },
  },
  p: {
    component: 'p',
    props: {
      style: { marginBlockStart: '0px' }
    },
  },
  span: {
    component: 'span',
    props: {
    },
  },
  a: {
    component: Link,
    props: {
      target: '_blank'
    },
  },
  li: {
    component: 'li',
    props: {
    },
  },
}

const StyledDiv = styled('div')(() => `
  background: transparent;
`);

const Markdown = ({ children, interaction_uuid }) => {
  const theme = useTheme();
  const markedTokens = marked.lexer(children || '')
  const {
    postMessageToVsCode,
  } = useContext(DataContext);
  const { onMonitorCopy } = useMonitorOnCopyEvent({ interaction_uuid })
  const onCopyToEditor = useCallback(
    (code, language) => () => {
      postMessageToVsCode && postMessageToVsCode({
        type: VsCodeMessageTypes.copyCodeToEditor,
        data: {
          code,
          language,
        }
      });
      onMonitorCopy(null, 'button_copy');
    },
    [postMessageToVsCode, onMonitorCopy],
  )

  return markedTokens.map(
    (markedToken, index) => markedToken.type === 'code' && markedToken.lang ? <Highlight
      key={index}
      theme={themes.vsDark}
      code={markedToken.text}
      language={markedToken.lang}
    >
      {({ className, style = {}, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: '8px 8px 8px 0' }}>
            <Tooltip title='Copy to editor'>
              <Box onClick={onCopyToEditor(markedToken.text, markedToken.lang)} sx={{ height: '24px', width: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <ContentCopyIcon sx={{ fontSize: '16px', color: theme.palette.icon.fill.primary }} />
              </Box>
            </Tooltip>
          </Box>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span>{' '}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
      :
      <MuiMarkdown
        key={index}
        overrides={{
          ...getOverrides(),
          ...MarkdownMapping,
          div: {
            component: StyledDiv,
            props: {},
          },
        }}>
        {markedToken.raw}
      </MuiMarkdown>
  )
};

export default Markdown;