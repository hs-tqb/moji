export function find(array, callback) {
  if (Array.prototype.find) {
    return array.find(callback);
  }

  for (let i = 0, len = array.length; i < len; i++) {
    if (callback(array[i])) {
      return i;
    }
  }
  return null;
}