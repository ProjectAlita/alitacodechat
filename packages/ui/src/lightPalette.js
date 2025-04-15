import { darkBlue, white } from './darkPalette.js';

// eslint-disable-next-line no-unused-vars
const white14 = 'rgba(255, 255, 255, 0.14)';
// const veryLightBlue = '#C7EBFF';
const blueFill08 = 'rgba(41, 184, 245, 0.08)'
const skyBlue20 = ' rgba(80, 161, 255, 0.2)';
const skyBlue40 = ' rgba(80, 161, 255, 0.4)';
const gray00 = '#D3DBE2';
const gray60 = '#0E131D';
const darkMagenta16 = 'rgba(245, 81, 249, 0.16)'
const darkMagenta24 = 'rgba(245, 81, 249, 0.24)';
const grey500 = '#ABB3B9';
const dangerRed = '#D71616';
const hoverRed = '#E74444'
const red15 = 'rgba(215, 22, 22, 0.15)'
const red20 = 'rgba(215, 22, 22, 0.20)'
const red40 = 'rgba(215, 22, 22, 0.4)'
const red = 'rgba(215, 22, 22, 1)'
const orange = '#F2994A';
const warningOrange = '#ED6C02';
const orange10 = 'rgba(211, 112, 21, 1)';
const orangeFill5 = 'rgba(233, 121, 18, 0.05)';
const orangeOutline40 = 'rgba(233, 121, 18, 0.4)';
const green20 = 'rgba(43, 212, 141, 0.20)'
const green = '#2AB37A';
const magenta = 'rgba(244, 124, 255, 1)'
const magenta24 = 'rgba(244, 124, 255, 0.24)'
const magentaDefault = 'rgba(196, 40, 221, 1)'
const magentaHover = 'rgba(244, 124, 255, 1)'
const darkMagenta30 = 'rgba(245, 81, 249, 0.3)'
const darkMagenta20 = 'rgba(245, 81, 249, 0.2)'
const darkMagenta10 = 'rgba(245, 81, 249, 0.1)'
const gradient = 'linear-gradient(270deg, #EBF1F8 0%, #FFF9FF 100%)'
const white01 = 'rgba(250, 250, 250, 1)'
const light10 = 'rgba(117, 117, 117, 1)'
const light20 = 'rgba(173, 175, 183, 1)'
const light30 = 'rgba(203, 206, 214, 1)'
const light40 = 'rgba(225, 229, 233, 1)'
const dark20 = 'rgba(61, 68, 86, 0.2)'
const dark10 = 'rgba(61, 68, 86, 0.1)'
const dark5 = 'rgba(61, 68, 86, 0.05)'
const gray30 = '#3B3E46';
const lightGrey = 'rgba(217, 217, 217, 1)'
export const blue01 = 'rgba(248, 252, 255, 1)'
const blue02 = 'rgba(110, 177, 255, 1)'
const blue03 = 'rgba(99, 144, 254, 1)'
const blue = 'rgba(41, 184, 245, 1)'


const lightPalette = {
  mode: 'light',
  primary: {
    main: magentaDefault,
    pressed: magentaDefault
  },
  secondary: {
    main: light10
  },
  info: {
    main: blue03,
    secondary: blue02
  },
  background: {
    default: blue01,
    alitaDefault: gradient,
    secondary: white,
    tabPanel: white01,
    userInputBackground: dark5,
    warningBkg: red15,
    wrongBkg: red40,
    categoriesButton: {
      selected: {
        active: blue03,
        hover: blue02
      }
    },
    dataGrid: {
      main: light40,
      secondary: white01,
    },
    tabButton: {
      active: dark20,
      default: dark5,
    },
    icon: {
      default: dark10,
      trophy: '#48433F',
      checkedBox: light10,
    },
    select: {
      hover: dark10,
      selected: {
        default: darkMagenta16,
        hover: darkMagenta24,
      }
    },
    button: {
      default: dark10,
      normal: dark10,
      danger: dangerRed,
      primary: {
        default: magentaDefault,
        hover: magentaHover,
        pressed: magentaDefault,
        disabled: light20,
      },
      secondary: {
        default: dark10,
        hover: dark20,
        pressed: gradient,
        disabled: light20,
      },
      alarm: {
        default: dangerRed,
        hover: hoverRed,
        pressed: hoverRed,
        disabled: light20,
      },
      drawerMenu: {
        default: 'transparent',
        hover: dark5,
        selected: dark10
      },
      magicAssistant: magenta24,
    },
    tooltip: {
      default: gray30
    },
    tips: blueFill08,
    attention: orangeFill5,
    text: {
      highlight: orange,
    },
    aiAnswerBkg: white,
    aiParticipantIcon: skyBlue20,
    aiAnswerActions: 'linear-gradient(270deg, #FFFFFF 82.5%, rgba(255, 255, 255, 0) 100%)',
    userMessageActions: 'linear-gradient(270deg, #EFF3FA 85.36%, rgba(236, 241, 249, 0) 100%)',
    conversationStarters: {
      default: skyBlue20,
      hover: skyBlue40
    },
    conversationEditor: light40,
    conversationTopCover: 'linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
    conversationBottomCover: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
    moderator: red20,
    avatar: lightGrey,
    categoryHeader: blue01,
    tag: {
      default: white,
      selected: blue03
    },
    notificationList: white,
    participant: {
      default: dark5,
      hover: dark10,
      active: darkMagenta10,
    },
    highlightUserMessage: skyBlue20,
    tagEditor: {
      tag: light40
    },
    tagChip: {
      default: white01,
      hover: dark20,
      active: {
        default: blue03,
        hover: blue02
      },
      disabled: dark10,
    },
    showContextDialog: gradient
  },
  border: {
    lines: light30,
    hover: light10,
    category: {
      selected: dark20,
    },
    tips: blue02,
    attention: orangeOutline40,
    table: light40,
    userMessageEditor: magentaDefault,
    notificationItem: light40,
    cardsOutlines: light40,
    conversationItemDivider: dark10,
    highlightUserMessage: skyBlue40,
    error: red,
    flowNode: light20
  },
  boxShadow: {
    default: `0px 2px 10px 0px rgba(100, 119, 136, 0.2)`,
    tagEditorPaper: '0px 2px 10px 0px rgba(100, 119, 136, 0.2)',
    tag: '0px 2px 4px 0px rgba(0, 0, 0, 0.06)'
  },
  text: {
    default: light10,
    primary: light10,
    secondary: gray60,
    button: {
      primary: blue01,
      secondary: blue01,
      disabled: light20,
      showMore: magentaDefault,
    },
    input: {
      label: light10,
      primary: gradient,
      placeholder: light30,
      disabled: light10,
    },
    select: {
      selected: {
        primary: gray60,
        secondary: light10,
      },
    },
    tag: {
      default: gray60,
      selected: white,
    },
    tagChip: {
      default: gray60,
      active: white,
      disabled: light20
    },
    info: blue03,
    tips: darkBlue,
    attention: orange10,
    metrics: gray00,
    contextHighLight: '#3d3d3d',
    warningText: red,
    deleteAlertEntityName: darkBlue
  },
  icon: {
    main: light10,
    fill: {
      default: light10,
      primary: grey500,
      secondary: gray60,
      send: white,
      trophy: '#FFD3A0',
      tips: darkBlue,
      disabled: light20,
      attention: orange,
      is_default: green20,
      success: green,
      active: magentaDefault,
      inactive: blue,
      magicAssistant: magenta,
      error: dangerRed,
      delete: white
    },
    tagChip: {
      default: light10,
      active: white,
      disabled: light20,
    },
  },
  split: {
    default: darkMagenta20,
    hover: darkMagenta30,
    pressed: darkMagenta10,
  },
  status: {
    draft: blue03,
    onModeration: '#E97912',
    published: green,
    rejected: dangerRed,
    userApproval: magenta,
  },
  warning: {
    main: warningOrange,
  }
}

export default lightPalette;
