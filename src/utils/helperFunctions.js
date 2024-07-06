export default function removeSpacesAndLowercase(str) {
  return str.trim().replace(/\s+/g, "").toLowerCase();
}
