export const filterProps = (...customProps) => ({
  shouldForwardProp: prop => !customProps.includes(prop)
});


export const getInitials = (name) => {
  if (typeof name !== 'string') {
    throw new TypeError('Name must be a string');
  }

  const names = name.split(' ');

  let firstName = names[0];
  let lastName = names[names.length - 1];
  if (names.length === 1) {
    firstName = name;
    lastName = '';
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return initials;
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const buildErrorMessage = (err) => {
  if (err?.originalStatus === 404) {
    return "The requested resource was not found!";
  }
  if (err?.data?.message) {
    return err?.data?.message;
  }
  if (err?.data?.error) {
    return err?.data?.error;
  }
  const location = (err?.data || [])[0]?.loc
  const msg = (err?.data || [])[0]?.msg
  if (location && msg) {
    return msg + ' at ' + (location || []).join(', ');
  } else {
    return typeof err === 'string' ? err : err?.data;
  }
};

export const removeTrailingSlashes = str => str.replace(/\/*$/, "");

export const convertJsonToString = (content) => {
  let result = content;
  if (typeof content !== 'string') {
    try {
      result = JSON.stringify(content, null, 2);
    } catch (_) {
      result = '' + content;
    }
  }
  
  // FIXME substring is workaround to handle huge messages from platform
  return result.substring(0, 1000);
}