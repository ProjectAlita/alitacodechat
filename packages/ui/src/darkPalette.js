
const primaryDefault = '#6ae8fa';
export const white = '#FFFFFF'
const white5 = 'rgba(255, 255, 255, 0.05)';
const white10 = 'rgba(255, 255, 255, 0.10)';
const white14 = 'rgba(255, 255, 255, 0.14)';
const white20 = 'rgba(255, 255, 255, 0.20)';
const white50 = 'rgba(255, 255, 255, 0.50)';
const veryLightBlue = '#C7EBFF';
const skyBlue = '#29B8F5';
const gray00 = '#D3DBE2';
const gray10 = '#A9B7C1';
const gray20 = '#686C76';
const gray30 = '#3B3E46';
const gray40 = '#262b34';
const gray50 = '#181F2A';
const gray55 = '#101721';
const gray60 = '#0E131D';
const blue5 = 'rgba(41, 184, 245, 0.05)';
const blue10 = 'rgba(106, 232, 250, 0.10)'
const blue16 = 'rgba(106, 232, 250, 0.16)'
const blue20 = 'rgba(106, 232, 250, 0.20)';
const blue24 = 'rgba(106, 232, 250, 0.24)';
const blue30 = 'rgba(106, 232, 250, 0.30)';
const blue40 = 'rgba(41, 184, 245, 0.40)';
const skyBlue20 = 'rgba(41, 184, 245, 0.20)';
export const darkBlue = '#006DD1';
const darkBlue40 = '#29B8F566';
const grey500 = '#ABB3B9';
const dangerRed = '#D71616';
const hoverRed = '#E74444'
const red15 = 'rgba(215, 22, 22, 0.15)'
const red20 = 'rgba(215, 22, 22, 0.20)'
const red40 = 'rgba(215, 22, 22, 0.4)'
const lightRed = 'rgba(255, 223, 223, 1)'
const primaryHover = '#83EFFF';
const primaryPressed = 'rgba(42, 189, 210, 1)';
const blue = 'rgba(41, 184, 245, 1)';
const orange = '#F2994A';
const warningOrange = '#ED6C02';
const lightOrange = 'rgba(255, 235, 211, 1)';
const orangeFill5 = 'rgba(233, 121, 18, 0.05)';
const orangeOutline40 = 'rgba(233, 121, 18, 0.4)';
const green20 = 'rgba(43, 212, 141, 0.20)'
const green = '#2BD48D';
const magenta40 = 'rgba(222, 126, 218, 0.4)';
const magenta20 = 'rgba(222, 126, 218, 0.2)'
const magenta = 'rgba(244, 124, 255, 1)'
const magenta24 = 'rgba(244, 124, 255, 0.24)'
const deepGrey = '#1a1f28';

const darkPalette = {
  mode: 'dark',
  primary: {
    main: primaryDefault,
    pressed: primaryPressed
  },
  secondary: {
    main: gray10
  },
  info: {
    main: darkBlue,
    secondary: darkBlue40
  },
  background: {
    default: gray60,
    alitaDefault: gray60,
    secondary: gray50,
    tabPanel: gray55,
    userInputBackground: white5,
    warningBkg: red15,
    wrongBkg: red40,
    categoriesButton: {
      selected: {
        active: darkBlue,
        hover: darkBlue40
      }
    },
    dataGrid: {
      main: gray40,
      secondary: gray55,
    },
    tabButton: {
      active: white20,
      default: white5,
    },
    icon: {
      default: white10,
      trophy: '#48433F',
      checkedBox: gray10,
    },
    select: {
      hover: white10,
      selected: {
        default: blue16,
        hover: blue24,
      }
    },
    button: {
      default: white10,
      normal: white10,
      danger: dangerRed,
      primary: {
        default: primaryDefault,
        hover: primaryHover,
        pressed: primaryPressed,
        disabled: gray20,
      },
      secondary: {
        default: white10,
        hover: white20,
        pressed: gray60,
        disabled: gray20,
      },
      alarm: {
        default: dangerRed,
        hover: hoverRed,
        pressed: hoverRed,
        disabled: gray20,
      },
      drawerMenu: {
        default: 'transparent',
        hover: white5,
        selected: white10
      },
      magicAssistant: magenta24,
    },
    tooltip: {
      default: gray00
    },
    tips: blue5,
    attention: orangeFill5,
    text: {
      highlight: orange,
    },
    aiAnswerBkg: gray40,
    aiParticipantIcon: skyBlue20,
    aiAnswerActions: 'linear-gradient(270deg, #262B34 82.5%, rgba(38, 43, 52, 0.00) 100%)',
    userMessageActions: 'linear-gradient(270deg, #0E131D 82.5%, rgba(14, 19, 29, 0.00) 100%)',
    conversationStarters: {
      default: magenta20,
      hover: magenta40
    },
    conversationEditor: gray40,
    conversationTopCover: 'linear-gradient(360deg, rgba(16, 23, 33, 0) 0%, #0E131D 100%)',
    conversationBottomCover: 'linear-gradient(180deg, rgba(16, 23, 33, 0) 0%, #0E131D 100%)',
    moderator: red20,
    avatar: deepGrey,
    categoryHeader: gray60,
    tag: {
      default: gray50,
      selected: darkBlue
    },
    notificationList: gray40,
    participant: {
      default: white5,
      hover: white10,
      active: blue10,
    },
    highlightUserMessage: magenta20,
    tagEditor: {
      tag: gray40
    },
    tagChip: {
      default: gray50,
      hover: white20,
      active: {
        default: darkBlue,
        hover: blue40
      },
      disabled: white10,
    },
    showContextDialog: gray50
  },
  border: {
    lines: gray30,
    hover: gray10,
    category: {
      selected: white20,
    },
    tips: blue40,
    attention: orangeOutline40,
    table: gray40,
    userMessageEditor: primaryPressed,
    notificationItem: gray60,
    cardsOutlines: gray40,
    conversationItemDivider: white10,
    highlightUserMessage: magenta40, 
    error: dangerRed,
    flowNode: gray20
  },
  boxShadow: {
    default: `0px 0px 8px 0px ${white14}`,
    tagEditorPaper: '0px 8px 12px 0px rgba(0, 0, 0, 0.3)',
    tag: 'none'
  },
  text: {
    default: gray10,
    primary: gray10,
    secondary: white,
    button: {
      primary: gray60,
      secondary: gray60,
      disabled: gray20,
      showMore: primaryPressed,
    },
    input: {
      label: gray10,
      primary: gray60,
      placeholder: gray30,
      disabled: white50,
    },
    select: {
      selected: {
        primary: white,
        secondary: gray10,
      },
    },
    tag: {
      default: white,
      selected: white,
    },
    tagChip: {
      default: white,
      active: white,
      disabled: gray20
    },
    info: skyBlue,
    tips: veryLightBlue,
    attention: lightOrange,
    metrics: gray00,
    contextHighLight: '#3d3d3d',
    warningText: lightRed,
    deleteAlertEntityName: skyBlue
  },
  icon: {
    main: gray10,
    fill: {
      default: gray10,
      primary: grey500,
      secondary: white,
      send: gray60,
      trophy: '#FFD3A0',
      tips: skyBlue,
      disabled: gray20,
      attention: orange,
      is_default: green20,
      success: green,
      active: primaryPressed,
      inactive: blue,
      magicAssistant: magenta,
      error: dangerRed,
      delete: gray50
    },
    tagChip: {
      default: gray10,
      active: white,
      disabled: gray20,
    },
  },
  split: {
    default: blue20,
    hover: blue30,
    pressed: blue10,
  },
  status: {
    draft: skyBlue,
    onModeration: '#E97912',
    published: green,
    rejected: dangerRed,
    userApproval: magenta,
  },
  warning: {
    main: warningOrange,
  }
}

export default darkPalette;
